import { CheckpointId } from '../src/types/pipeline.js';

export interface RubricCheckpointDefinition {
  id: CheckpointId;
  title: string;
  dimension: string;
  description: string;
  passCriteria: string;
  failConditions: string[];
}

export const RUBRIC_CHECKPOINTS: RubricCheckpointDefinition[] = [
  {
    id: 'ACCURATE_AND_GROUNDED',
    title: 'Accurate & Grounded',
    dimension: 'Technical Fidelity & Conceptual Correctness',
    description: 'Ensure factual truth and technical precision without misleading simplifications.',
    passCriteria: 'The technical mechanics and conceptual principles are 100% accurate for the specific topic. For RAG: correctly clarifies that model weights are never retrained; for Python: correctly explains interpreted execution and syntax; for other topics: adheres to factual domain standards.',
    failConditions: [
      'States factual falsehoods or misrepresents core technical architecture.',
      'Claims that tools or techniques perform actions contrary to how they operate (e.g. claiming RAG fine-tunes weights or that Python is purely compiled directly to machine code).',
      'Confuses distinct concepts or presents misleading simplifications.'
    ]
  },
  {
    id: 'BEGINNER_FRIENDLY_LANGUAGE',
    title: 'Beginner-Friendly Language',
    dimension: 'Audience Empathy & Tone Accessibility',
    description: 'Assumes learner starts from absolute zero background knowledge.',
    passCriteria: 'Uses welcoming, empathetic language that assumes zero prior computer science or technical background. Relies on relatable everyday metaphors and intuitive analogies.',
    failConditions: [
      'Assumes prior knowledge of advanced computer science or engineering concepts.',
      'Uses overly academic, cold, or textbook-stiff prose.',
      'Condescending or overly simplistic childish tone without substance.'
    ]
  },
  {
    id: 'TEACHES_BY_EXAMPLE',
    title: 'Teaches by Example',
    dimension: 'Concrete Mental Models & Walkthrough Traces',
    description: 'Must provide both a high-level intuitive mental model and a concrete practical trace.',
    passCriteria: 'Includes: (1) A sticky real-world mental model/analogy (e.g. recipe instructions for Python, open-book exam for RAG, tree branches for Git), AND (2) A step-by-step walkthrough trace of a concrete task, query, or problem showing inputs, intermediate actions, and final outputs.',
    failConditions: [
      'Explains only in abstract generalities without showing a real sample scenario.',
      'Mental model is weak, vague, or absent.',
      'Lacks a concrete step-by-step walkthrough showing the exact lifecycle of an example task or query.'
    ]
  },
  {
    id: 'NO_UNEXPLAINED_JARGON',
    title: 'Clear, No Unexplained Jargon',
    dimension: 'Zero-Tolerance Terminology Scaffolding',
    description: 'Every technical term must be demystified immediately.',
    passCriteria: 'Every technical term relevant to the topic (e.g. interpreter, script, variables, functions, embeddings, vector database, context window, commit, branch) is clearly defined in plain English before or at the moment it is introduced.',
    failConditions: [
      'Mentions technical buzzwords or jargon without first anchoring what they mean in plain language.',
      'Uses acronyms without expanding and defining them.'
    ]
  },
  {
    id: 'COVERS_KEY_POINTS',
    title: 'Covers Key Points',
    dimension: 'Curricular Completeness',
    description: 'Must comprehensively answer What it is, Why it matters, and How it works.',
    passCriteria: 'Explicitly covers the 3 essential questions: (1) What it is in plain English, (2) Why it matters / the exact real-world pain points it solves, and (3) How it works step-by-step in clear phases.',
    failConditions: [
      'Omits why it matters or the real problem it solves.',
      'Omits how it works or skips core execution steps.',
      'Fails to provide clear summary takeaways.'
    ]
  },
  {
    id: 'COHERENT_TEACHING_FLOW',
    title: 'Coherent Teaching Flow',
    dimension: 'Pedagogical Narrative & Scaffolding',
    description: 'Progresses logically from familiar to new, with check for understanding.',
    passCriteria: 'Features a cohesive narrative arc: Hook -> Everyday Analogy -> Conceptual Definition -> Problem Solved -> Mechanical Walkthrough -> Practical Example -> Interactive Knowledge Check -> Summary.',
    failConditions: [
      'Disjointed bullet lists without connective tissue.',
      'Abrupt conceptual leaps without transitional scaffolding.',
      'Missing interactive knowledge check / comprehension questions.'
    ]
  }
];
