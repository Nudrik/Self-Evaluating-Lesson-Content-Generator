import { LearnedMemoryRule } from '../src/types/pipeline.js';

// Pre-seeded foundational pedagogical guardrails learned from benchmark runs
export const INITIAL_MEMORY_RULES: LearnedMemoryRule[] = [
  {
    id: 'rule-universal-1',
    title: 'Pre-Emptive Terminology Scaffolding',
    category: 'JARGON',
    ruleText: 'Never introduce abstract technical terms without first anchoring them in an intuitive everyday comparison or plain-English analogy.',
    originTopic: 'Universal Pedagogy',
    learnedFromIteration: 1,
    createdAt: '2026-11-01T00:00:00.000Z',
    active: true,
    timesApplied: 18,
  },
  {
    id: 'rule-universal-2',
    title: 'Input-to-Output Concrete Trace',
    category: 'PEDAGOGY',
    ruleText: 'Every walkthrough must show a concrete starting input, intermediate action, and clear tangible result, rather than high-level generalities.',
    originTopic: 'Universal Pedagogy',
    learnedFromIteration: 2,
    createdAt: '2026-11-02T00:00:00.000Z',
    active: true,
    timesApplied: 15,
  },
  {
    id: 'rule-topic-rag-1',
    title: 'The Open-Book Exam Framing for RAG',
    category: 'ANALOGY',
    ruleText: 'When teaching RAG, frame standard LLMs as taking a closed-book memory exam, and RAG as giving the student an open textbook and search index.',
    originTopic: 'Introduction to RAG',
    learnedFromIteration: 1,
    createdAt: '2026-11-03T00:00:00.000Z',
    active: true,
    timesApplied: 14,
  },
  {
    id: 'rule-topic-rag-2',
    title: 'Explicit Weight Non-Modification Rule for RAG',
    category: 'GROUNDING',
    ruleText: 'For RAG topics: explicitly clarify that RAG does NOT alter or retrain the AI model\'s brain/weights; it simply passes relevant facts into the prompt before generating.',
    originTopic: 'Introduction to RAG',
    learnedFromIteration: 1,
    createdAt: '2026-11-04T00:00:00.000Z',
    active: true,
    timesApplied: 11,
  },
  {
    id: 'rule-topic-python-1',
    title: 'The Recipe & Chef Analogy for Python',
    category: 'ANALOGY',
    ruleText: 'When introducing Python to beginners, compare the computer to a very fast, literal-minded chef, and Python code to a step-by-step recipe that tells the chef exactly what to prepare.',
    originTopic: 'Introduction to Python',
    learnedFromIteration: 1,
    createdAt: '2026-11-05T00:00:00.000Z',
    active: true,
    timesApplied: 8,
  },
];

let inMemoryStore: LearnedMemoryRule[] = [...INITIAL_MEMORY_RULES];

export function getMemoryRules(): LearnedMemoryRule[] {
  return inMemoryStore;
}

export function addMemoryRule(rule: LearnedMemoryRule): void {
  const existingIdx = inMemoryStore.findIndex((r) => r.id === rule.id);
  if (existingIdx >= 0) {
    inMemoryStore[existingIdx] = rule;
  } else {
    inMemoryStore.unshift(rule);
  }
}

export function toggleMemoryRule(id: string): LearnedMemoryRule | null {
  const rule = inMemoryStore.find((r) => r.id === id);
  if (rule) {
    rule.active = !rule.active;
    return rule;
  }
  return null;
}

export function deleteMemoryRule(id: string): boolean {
  const initialLen = inMemoryStore.length;
  inMemoryStore = inMemoryStore.filter((r) => r.id !== id);
  return inMemoryStore.length < initialLen;
}

export function resetMemoryRules(): LearnedMemoryRule[] {
  inMemoryStore = [...INITIAL_MEMORY_RULES];
  return inMemoryStore;
}
