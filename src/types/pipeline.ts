export type CheckpointId =
  | 'ACCURATE_AND_GROUNDED'
  | 'BEGINNER_FRIENDLY_LANGUAGE'
  | 'TEACHES_BY_EXAMPLE'
  | 'NO_UNEXPLAINED_JARGON'
  | 'COVERS_KEY_POINTS'
  | 'COHERENT_TEACHING_FLOW';

export interface CheckpointEvaluation {
  id: CheckpointId;
  title: string;
  dimension: string;
  status: 'PASS' | 'FAIL';
  evidence: string;
  critique: string;
  remedySuggestion: string;
}

export interface EvaluationReport {
  verdict: 'PASS' | 'FAIL';
  passedCount: number;
  totalCount: number;
  checkpoints: CheckpointEvaluation[];
  rejectionSummary?: string;
  evaluatorTimestamp: number;
}

export interface MentalModel {
  title: string;
  analogy: string;
  takeaway: string;
}

export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  explanation: string;
  analogyTip: string;
}

export interface WalkthroughStep {
  step: string;
  whatHappens: string;
  output: string;
}

export interface WalkthroughExample {
  query: string;
  context: string;
  stepByStepTrace: WalkthroughStep[];
  finalAnswer: string;
}

export interface KnowledgeCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContent {
  topic: string;
  title: string;
  hook: string;
  mentalModel: MentalModel;
  whatItIs: string;
  whyItMatters: {
    problemSolved: string;
    consequencesOfNotUsing: string;
  };
  howItWorks: HowItWorksStep[];
  walkthroughExample: WalkthroughExample;
  knowledgeCheck: KnowledgeCheckQuestion[];
  summaryTakeaways: string[];
  rawMarkdown?: string;
}

export interface IterationRecord {
  iteration: number;
  status: 'DRAFT_GENERATED' | 'EVALUATED_FAILED' | 'EVALUATED_PASSED';
  lesson: LessonContent;
  evaluation: EvaluationReport;
  promptUsed: string;
  criticFeedbackFedForward?: string;
  timestamp: number;
  durationMs: number;
}

export interface ViolationSnippet {
  checkpointTitle: string;
  quote: string;
  critique: string;
  remedy: string;
}

export interface RejectionLogItem {
  iteration: number;
  failedCheckpoints: string[];
  violations: ViolationSnippet[];
  remedyPromptInjected: string;
  diffSummary: string;
}

export interface LearnedMemoryRule {
  id: string;
  title: string;
  category: 'JARGON' | 'PEDAGOGY' | 'ANALOGY' | 'GROUNDING' | 'STRUCTURE';
  ruleText: string;
  originTopic: string;
  learnedFromIteration: number;
  createdAt: string;
  active: boolean;
  timesApplied: number;
}

export interface PipelineExecutionResult {
  id: string;
  topic: string;
  learnerLevel: string;
  status: 'SHIPPED' | 'HALTED';
  iterations: IterationRecord[];
  rejectionLogs: RejectionLogItem[];
  shippedLesson: LessonContent | null;
  finalVerdict: 'SHIPPED' | 'TERMINAL_FAIL';
  metrics: {
    totalDurationMs: number;
    totalAttempts: number;
    retryCount: number;
    initialPassCount: number;
    finalPassCount: number;
  };
  synthesizedRules: LearnedMemoryRule[];
}

export interface RunPipelineOptions {
  topic: string;
  learnerLevel?: string;
  maxRetries?: number;
  forceStrictRejectionFirst?: boolean;
  activeMemoryRules?: LearnedMemoryRule[];
}
