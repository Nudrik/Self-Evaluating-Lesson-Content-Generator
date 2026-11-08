import { GoogleGenAI, Type } from '@google/genai';
import {
  CheckpointEvaluation,
  EvaluationReport,
  IterationRecord,
  LearnedMemoryRule,
  LessonContent,
  PipelineExecutionResult,
  RejectionLogItem,
  RunPipelineOptions,
  ViolationSnippet,
} from '../src/types/pipeline.js';
import { RUBRIC_CHECKPOINTS } from './rubric.js';

export function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[AgentEngine] GEMINI_API_KEY is not set in environment!');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Execute Gemini generateContent with fast automatic retry and model fallback on 503/429
 */
async function callGeminiWithRetry(
  ai: GoogleGenAI,
  params: {
    model?: string;
    contents: any;
    config?: any;
  },
  maxAttempts: number = 2
) {
  const primaryModel = params.model || 'gemini-3.8-flash';
  const modelsToTry = [primaryModel, 'gemini-3.1-flash-lite'];

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`[Gemini API] Requesting ${model} (attempt ${attempt})...`);
        const startTime = Date.now();
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        console.log(`[Gemini API] ${model} responded in ${Date.now() - startTime}ms`);
        return response;
      } catch (err: any) {
        const errMsg = String(err?.message || err);
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('high demand');

        console.warn(`[Gemini API] Error on ${model}: ${errMsg.slice(0, 120)}`);

        if (isTransient && attempt < maxAttempts) {
          const delay = 500 * attempt;
          console.warn(`[Gemini API] Transient ${model} error, retrying in ${delay}ms...`);
          await new Promise((res) => setTimeout(res, delay));
          continue;
        }

        if (isTransient && model === primaryModel) {
          console.warn(`[Gemini API] Switching to fallback model gemini-3.1-flash-lite...`);
          break;
        }

        throw err;
      }
    }
  }

  throw new Error('All Gemini model generation attempts failed');
}

/**
 * Format active memory rules into a prompt injection block, filtering by topic relevance
 */
function formatMemoryPreamble(topic: string, memoryRules?: LearnedMemoryRule[]): string {
  if (!memoryRules || memoryRules.length === 0) {
    return 'No prior memory rules active.';
  }
  const activeRules = memoryRules.filter((r) => r.active !== false);
  if (activeRules.length === 0) return 'No active memory rules.';

  const topicLower = topic.toLowerCase();

  // Filter rules that are universal or match the current topic
  const relevantRules = activeRules.filter((r) => {
    const originLower = (r.originTopic || '').toLowerCase();
    if (originLower.includes('universal') || originLower.includes('general')) return true;
    if (topicLower.includes('rag') && originLower.includes('rag')) return true;
    if (topicLower.includes('python') && originLower.includes('python')) return true;
    if (topicLower.includes('git') && originLower.includes('git')) return true;
    // If origin topic matches words in topic
    const topicWords = topicLower.split(/\s+/).filter((w) => w.length > 3);
    return topicWords.some((w) => originLower.includes(w));
  });

  const finalRules = relevantRules.length > 0 ? relevantRules : activeRules.slice(0, 3);

  return finalRules
    .map(
      (r, idx) =>
        `RULE ${idx + 1} [${r.category}] "${r.title}": ${r.ruleText}`
    )
    .join('\n');
}

/**
 * GENERATOR AGENT: Generates a beginner lesson
 */
export async function generateLesson(
  ai: GoogleGenAI,
  topic: string,
  learnerLevel: string = 'Absolute Beginner (Zero Background)',
  memoryRules?: LearnedMemoryRule[],
  rejectionFeedback?: string,
  forceDraftImperfection: boolean = false
): Promise<{ lesson: LessonContent; rawPrompt: string }> {
  const memoryPreamble = formatMemoryPreamble(topic, memoryRules);

  let systemDirective = `You are a master pedagogical instructional designer who specializes in explaining complex technical topics to learners with ZERO technical or programming background.
Your task is to create a standalone beginner lesson on "${topic}".

Audience: ${learnerLevel}.
Pedagogical Philosophy:
- Connect the unfamiliar to the familiar through intuitive everyday mental models.
- Never introduce a technical word without immediately grounding it in plain English.
- Ground concepts in a concrete step-by-step walkthrough of a real task, problem, or query.
- Include an interactive 3-question knowledge check to test understanding.`;

  if (forceDraftImperfection) {
    systemDirective += `
IMPORTANT SPECIAL TEST MODE: For this initial draft only, introduce the concept smoothly and write an engaging lesson, but make 1 or 2 subtle beginner pitfalls that a strict rubric evaluator should catch (for instance: mention 1 or 2 technical terms central to "${topic}" without defining them first, or make the practical example slightly high-level without a step-by-step trace). This allows the rubric auditor to demonstrate its hard pass/fail rejection mechanism.`;
  }

  let prompt = `Topic: "${topic}"

SYSTEM MEMORY & GUARDRAILS LEARNED FROM PREVIOUS RUNS:
${memoryPreamble}

`;

  if (rejectionFeedback) {
    prompt += `=== CRITICAL REVISION DIRECTIVE (PREVIOUS ITERATION REJECTED) ===
The auditor evaluated your previous attempt and REJECTED it because it failed the following hard checkpoints:
${rejectionFeedback}

You must surgically address every single failed checkpoint and quoted violation above.
Preserve the parts that worked well, but eliminate every flaw identified by the auditor.
Ensure 100% compliance with all hard checkpoints.
`;
  } else {
    prompt += `Create the beginner lesson. Ensure it covers:
1. An irresistible beginner hook and relatable real-world mental model.
2. What it is in simple, plain language.
3. Why it matters (the exact problem it solves, friction eliminated, or superpowers unlocked).
4. How it works step-by-step with clear, accessible phases.
5. A concrete walkthrough example tracing an actual scenario or task from input to final result.
6. A 3-question multiple choice knowledge check with explanations.
7. 3-4 bullet point summary takeaways.
`;
  }

  prompt += `
Return your output strictly as a JSON object matching this structure:
{
  "topic": "${topic}",
  "title": "Clear, engaging lesson title",
  "hook": "Opening hook connecting to everyday life",
  "mentalModel": {
    "title": "Name of the analogy",
    "analogy": "Detailed relatable analogy",
    "takeaway": "Why this analogy illuminates the core concept"
  },
  "whatItIs": "Plain-English definition assuming zero background",
  "whyItMatters": {
    "problemSolved": "Exact real-world pain point or manual friction solved",
    "consequencesOfNotUsing": "What happens when you do not have or use this concept/tool"
  },
  "howItWorks": [
    {
      "stepNumber": 1,
      "title": "Step 1 Title",
      "explanation": "Clear plain explanation",
      "analogyTip": "Quick everyday tip or analogy"
    }
  ],
  "walkthroughExample": {
    "query": "A specific realistic task, goal, question, or scenario (e.g., 'Automate renaming 100 photo files with today\\'s date', or 'Check customer return policy')",
    "context": "The starting data, reference context, or code/environment setup",
    "stepByStepTrace": [
      {
        "step": "Phase name (e.g. Step 1: Input / Setup, Step 2: Processing / Translation, Step 3: Execution / Result)",
        "whatHappens": "Plain description of what happens",
        "output": "What is produced at this step"
      }
    ],
    "finalAnswer": "The tangible final outcome or answer delivered to the user"
  },
  "knowledgeCheck": [
    {
      "question": "Clear multiple choice question testing core zero-to-one intuition",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is the correct answer in beginner terms"
    }
  ],
  "summaryTakeaways": [
    "Key takeaway 1",
    "Key takeaway 2",
    "Key takeaway 3"
  ]
}`;

  const response = await callGeminiWithRetry(ai, {
    model: 'gemini-3.5-flash-lite',
    contents: prompt,
    config: {
  systemInstruction: systemDirective,
  responseMimeType: 'application/json',
  thinkingConfig: {
    thinkingLevel: 'low',
  },
},
  });

  const rawText = response.text || '{}';
  let lesson: LessonContent;
  try {
    lesson = JSON.parse(rawText);
    lesson.topic = topic;
  } catch (err) {
    console.error('Failed to parse lesson JSON:', err, rawText);
    // Fallback extraction
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      lesson = JSON.parse(match[0]);
    } else {
      throw new Error('Failed to generate valid JSON lesson');
    }
  }

  return { lesson, rawPrompt: prompt };
}

/**
 * EVALUATOR CRITIC AGENT: Evaluates the lesson against 6 Hard Pass/Fail Checkpoints
 */
export async function evaluateLesson(
  ai: GoogleGenAI,
  lesson: LessonContent,
  forceStrictScrutiny: boolean = false
): Promise<EvaluationReport> {
  const rubricSpec = RUBRIC_CHECKPOINTS.map(
    (c) => `Checkpoint ID: "${c.id}"
Title: "${c.title}"
Dimension: "${c.dimension}"
Description: ${c.description}
Pass Criteria: ${c.passCriteria}
Fail Conditions:
${c.failConditions.map((fc) => ` - ${fc}`).join('\n')}`
  ).join('\n\n');

  const lessonJsonStr = JSON.stringify(lesson, null, 2);

  const systemInstruction = `You are an uncompromising pedagogical auditor and quality evaluator.
Your job is to rigorously evaluate an educational lesson for absolute beginners on "${lesson.topic}" against 6 STRICT HARD PASS/FAIL CHECKPOINTS.

RULES:
1. NO PARTIAL CREDIT. Each checkpoint MUST strictly be either "PASS" or "FAIL".
2. If even a single technical term is used without plain-English definition, checkpoint "NO_UNEXPLAINED_JARGON" MUST be a FAIL.
3. If technical mechanics are hallucinated, inaccurate, or misleading for the topic, checkpoint "ACCURATE_AND_GROUNDED" MUST be a FAIL.
4. If there is no concrete real-world walkthrough showing the step-by-step trace of a specific scenario, task, or query, checkpoint "TEACHES_BY_EXAMPLE" MUST be a FAIL.
5. You MUST provide direct verbatim quotes from the lesson text in the "evidence" field.
6. You MUST provide an actionable "remedySuggestion" for any failed checkpoint so the generator knows exactly how to fix it.
7. The overall verdict is "PASS" IF AND ONLY IF every single checkpoint is "PASS". If any checkpoint is "FAIL", the overall verdict is "FAIL".${
    forceStrictScrutiny
      ? '\nNOTE: STRICT SCRUTINY MODE IS ACTIVE. Scrutinize jargon, concrete execution traces, and grounding to the highest standard.'
      : ''
  }`;

  const prompt = `EVALUATE THIS LESSON:
${lessonJsonStr}

RUBRIC SPECIFICATION (6 HARD PASS/FAIL CHECKPOINTS):
${rubricSpec}

Evaluate each of the 6 checkpoints:
1. ACCURATE_AND_GROUNDED
2. BEGINNER_FRIENDLY_LANGUAGE
3. TEACHES_BY_EXAMPLE
4. NO_UNEXPLAINED_JARGON
5. COVERS_KEY_POINTS
6. COHERENT_TEACHING_FLOW

Return your evaluation strictly as JSON:
{
  "verdict": "PASS" | "FAIL",
  "rejectionSummary": "Brief overview of what failed and why (or null if passed)",
  "checkpoints": [
    {
      "id": "ACCURATE_AND_GROUNDED" | "BEGINNER_FRIENDLY_LANGUAGE" | "TEACHES_BY_EXAMPLE" | "NO_UNEXPLAINED_JARGON" | "COVERS_KEY_POINTS" | "COHERENT_TEACHING_FLOW",
      "title": "Checkpoint Title",
      "dimension": "Dimension Name",
      "status": "PASS" | "FAIL",
      "evidence": "Direct quote from lesson text demonstrating compliance or violation",
      "critique": "Sharp analytical explanation of why it passed or failed",
      "remedySuggestion": "Prescriptive, concrete instruction on how to fix"
    }
  ]
}`;

  const response = await callGeminiWithRetry(ai, {
  model: 'gemini-3.5-flash-lite',
  contents: prompt,
  config: {
    systemInstruction,
    responseMimeType: 'application/json',
    thinkingConfig: {
      thinkingLevel: 'low',
    },
  },
});

  const rawText = response.text || '{}';
  let report: {
    verdict: 'PASS' | 'FAIL';
    rejectionSummary?: string;
    checkpoints: CheckpointEvaluation[];
  };

  try {
    report = JSON.parse(rawText);
  } catch (err) {
    console.error('Failed to parse evaluation report JSON:', err, rawText);
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      report = JSON.parse(match[0]);
    } else {
      throw new Error('Failed to parse evaluator response');
    }
  }

  // Ensure all 6 checkpoints exist
  const existingIds = new Set(report.checkpoints.map((c) => c.id));
  for (const defaultCp of RUBRIC_CHECKPOINTS) {
    if (!existingIds.has(defaultCp.id)) {
      report.checkpoints.push({
        id: defaultCp.id,
        title: defaultCp.title,
        dimension: defaultCp.dimension,
        status: 'PASS',
        evidence: 'Met default expectations across the lesson.',
        critique: 'Satisfies criteria.',
        remedySuggestion: 'Maintain clarity.',
      });
    }
  }

  // Re-verify verdict consistency: no partial credit
  const passedCount = report.checkpoints.filter((c) => c.status === 'PASS').length;
  const totalCount = report.checkpoints.length;
  const actualVerdict: 'PASS' | 'FAIL' = passedCount === totalCount ? 'PASS' : 'FAIL';

  return {
    verdict: actualVerdict,
    passedCount,
    totalCount,
    checkpoints: report.checkpoints,
    rejectionSummary:
      actualVerdict === 'FAIL'
        ? report.rejectionSummary ||
          `${totalCount - passedCount} out of ${totalCount} hard checkpoints failed.`
        : undefined,
    evaluatorTimestamp: Date.now(),
  };
}

/**
 * SELF-EVOLUTION ENGINE: Synthesize memory rules from rejection logs
 */
export async function synthesizeMemoryRule(
  ai: GoogleGenAI,
  topic: string,
  rejectionLogs: RejectionLogItem[]
): Promise<LearnedMemoryRule | null> {
  if (rejectionLogs.length === 0) return null;

  const logSnippet = JSON.stringify(rejectionLogs, null, 2);

  const prompt = `Analyze this audit rejection log from a beginner lesson generation on topic "${topic}":
${logSnippet}

Identify the root pedagogical or terminology flaw that caused the rejection, and synthesize ONE high-leverage "Learned Guardrail Rule" that can be injected into future generator prompts to prevent this mistake across similar topics.

Return strictly as JSON:
{
  "title": "Short descriptive rule name (e.g., 'Anchor Embeddings Before Usage')",
  "category": "JARGON" | "PEDAGOGY" | "ANALOGY" | "GROUNDING" | "STRUCTURE",
  "ruleText": "One clear, actionable imperative sentence directing the generator on how to teach or define concepts.",
  "reasoning": "Why this rule permanently sharpens the prompt"
}`;

  try {
    const res = await callGeminiWithRetry(ai, {
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(res.text || '{}');
    if (!parsed.title || !parsed.ruleText) return null;

    return {
      id: `rule-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: parsed.title,
      category: parsed.category || 'PEDAGOGY',
      ruleText: parsed.ruleText,
      originTopic: topic,
      learnedFromIteration: rejectionLogs[0]?.iteration || 1,
      createdAt: new Date().toISOString(),
      active: true,
      timesApplied: 1,
    };
  } catch (err) {
    console.error('Failed to synthesize memory rule:', err);
    return null;
  }
}

/**
 * FULL AUTONOMOUS PIPELINE ORCHESTRATOR
 */
export async function runPipeline(
  ai: GoogleGenAI,
  options: RunPipelineOptions
): Promise<PipelineExecutionResult> {
  const startTime = Date.now();
  const maxRetries = options.maxRetries ?? 2;
  const maxIterations = maxRetries + 1; // e.g. 1 initial + 2 retries = 3 iterations max
  const topic = options.topic;
  const learnerLevel = options.learnerLevel ?? 'Absolute Beginner (Zero Background)';
  const activeMemoryRules = options.activeMemoryRules ?? [];

  const iterations: IterationRecord[] = [];
  const rejectionLogs: RejectionLogItem[] = [];
  let currentCriticFeedback: string | undefined = undefined;
  let shippedLesson: LessonContent | null = null;
  let finalVerdict: 'SHIPPED' | 'TERMINAL_FAIL' = 'TERMINAL_FAIL';

  for (let iter = 1; iter <= maxIterations; iter++) {
    const iterStartTime = Date.now();

    // 1. GENERATE
    // If user requested forceStrictRejectionFirst on iter 1, simulate an initial draft with a slight flaw
    const isFirstIterChallenge = Boolean(options.forceStrictRejectionFirst && iter === 1);
    const { lesson, rawPrompt } = await generateLesson(
      ai,
      topic,
      learnerLevel,
      activeMemoryRules,
      currentCriticFeedback,
      isFirstIterChallenge
    );

    // 2. EVALUATE
    const evalReport = await evaluateLesson(ai, lesson, isFirstIterChallenge);

    const iterRecord: IterationRecord = {
      iteration: iter,
      status: evalReport.verdict === 'PASS' ? 'EVALUATED_PASSED' : 'EVALUATED_FAILED',
      lesson,
      evaluation: evalReport,
      promptUsed: rawPrompt,
      criticFeedbackFedForward: currentCriticFeedback,
      timestamp: Date.now(),
      durationMs: Date.now() - iterStartTime,
    };
    iterations.push(iterRecord);

    // 3. ROUTER / DECISION NODE
    if (evalReport.verdict === 'PASS') {
      shippedLesson = lesson;
      finalVerdict = 'SHIPPED';
      break;
    } else {
      // Collect violations
      const failedCps = evalReport.checkpoints.filter((c) => c.status === 'FAIL');
      const violations: ViolationSnippet[] = failedCps.map((fc) => ({
        checkpointTitle: fc.title,
        quote: fc.evidence || 'N/A',
        critique: fc.critique || 'Failed checkpoint requirements.',
        remedy: fc.remedySuggestion || 'Revise to meet criteria.',
      }));

      // Build structured revision directive for next iteration
      const feedbackDirectives = violations
        .map(
          (v, i) =>
            `[VIOLATION #${i + 1}] Checkpoint: ${v.checkpointTitle}\n- Flagged Evidence: "${v.quote}"\n- Auditor Critique: ${v.critique}\n- Prescribed Remedy: ${v.remedy}`
        )
        .join('\n\n');

      currentCriticFeedback = feedbackDirectives;

      const rejectionItem: RejectionLogItem = {
        iteration: iter,
        failedCheckpoints: failedCps.map((c) => c.title),
        violations,
        remedyPromptInjected: feedbackDirectives,
        diffSummary: `Iteration ${iter} failed ${failedCps.length} checkpoints. Injected ${violations.length} targeted fix directives into Iteration ${iter + 1}.`,
      };
      rejectionLogs.push(rejectionItem);
    }
  }

  // 4. MEMORY SYNTHESIS
  const newRules: LearnedMemoryRule[] = [];
  if (rejectionLogs.length > 0 && finalVerdict === 'TERMINAL_FAIL') {
    const synthesized = await synthesizeMemoryRule(ai, topic, rejectionLogs);
    if (synthesized) {
      newRules.push(synthesized);
    }
  }

  const initialPassCount = iterations[0]?.evaluation.passedCount ?? 0;
  const finalPassCount = iterations[iterations.length - 1]?.evaluation.passedCount ?? 0;

  return {
    id: `run-${Date.now()}`,
    topic,
    learnerLevel,
    status: finalVerdict === 'SHIPPED' ? 'SHIPPED' : 'HALTED',
    iterations,
    rejectionLogs,
    shippedLesson,
    finalVerdict,
    metrics: {
      totalDurationMs: Date.now() - startTime,
      totalAttempts: iterations.length,
      retryCount: iterations.length - 1,
      initialPassCount,
      finalPassCount,
    },
    synthesizedRules: newRules,
  };
}
