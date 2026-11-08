import React, { useState, useEffect } from 'react';
import {
  PipelineExecutionResult,
  LearnedMemoryRule,
} from '../types/pipeline.js';
import { LessonReader } from './LessonReader.js';
import {
  ArrowRight,
  BookOpen,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';

interface PipelineStudioProps {
  currentResult: PipelineExecutionResult | null;
  onRunPipeline: (topic: string, forceStrictFirst: boolean) => Promise<void>;
  isRunning: boolean;
  activeMemoryRules: LearnedMemoryRule[];
  onNavigateToTab: (tab: 'rejections' | 'memory' | 'architecture') => void;
}

export const PipelineStudio: React.FC<PipelineStudioProps> = ({
  currentResult,
  onRunPipeline,
  isRunning,
  activeMemoryRules,
  onNavigateToTab,
}) => {
  const [topic, setTopic] = useState<string>('Introduction to Python');
  const [forceStrictFirst, setForceStrictFirst] = useState<boolean>(false);
  const [executionPhaseIndex, setExecutionPhaseIndex] = useState<number>(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);

  const topicPresets = [
    { label: 'Introduction to Python', value: 'Introduction to Python' },
    { label: 'Introduction to RAG', value: 'Introduction to RAG' },
    { label: 'Understanding LLMs', value: 'LLM and its importance' },
    { label: 'Vector Embeddings', value: 'Vector Embeddings & Semantic Search' },
    { label: 'Git & Branching', value: 'Git Branching & Merge Conflicts' },
  ];

  // Rotate helpful phase messages during generation
  useEffect(() => {
    if (!isRunning) {
      setExecutionPhaseIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setExecutionPhaseIndex((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, [isRunning]);

  const executionPhases = [
    'Drafting lesson outline, everyday analogies, and examples...',
    'Reviewing against 6 core pedagogical standards...',
    'Checking for unexplained jargon and technical clarity...',
    'Polishing explanations and interactive practice questions...',
  ];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isRunning) return;
    onRunPipeline(topic.trim(), forceStrictFirst);
  };

  const latestIteration = currentResult?.iterations[currentResult.iterations.length - 1];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Generator Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] transition-all">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
            <span>Autonomous Curriculum Engine</span>
            <span aria-hidden="true">·</span>
            <span>Zero-to-One Pedagogy</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">6 Quality Invariants</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
            Beginner Lesson Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
            Generates intuitive, zero-background guides with real-world analogies, audits drafts against 6 binary quality standards, and self-refines until ready to publish.
          </p>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleStart} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic to teach (e.g. Introduction to Python, RAG, Git, Databases)..."
                className="w-full text-sm px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 text-slate-900 bg-white placeholder:text-slate-400 transition-all shadow-2xs"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isRunning || !topic.trim()}
              className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-150 shadow-sm hover:shadow active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-300" />
                  <span>Reviewing Draft...</span>
                </>
              ) : (
                <>
                  <span>Build Lesson</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>

          {/* Topic Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 text-xs">
            <span className="text-slate-400 font-medium shrink-0 mr-1">Suggestions:</span>
            {topicPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTopic(preset.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  topic === preset.value
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200/90 hover:border-slate-400 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Options toggle */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="hover:text-slate-900 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvancedOptions ? 'Hide options' : 'Options'}</span>
            </button>

            <span className="text-slate-500 font-mono text-[11px]">
              Guaranteed loop termination: max 2 retries
            </span>
          </div>

          {showAdvancedOptions && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs animate-in fade-in duration-200">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={forceStrictFirst}
                  onChange={(e) => setForceStrictFirst(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4 accent-slate-900"
                />
                <span className="text-slate-700 font-medium">
                  Challenge Mode: Inject initial draft flaws to simulate audit rejection and recovery
                </span>
              </label>
            </div>
          )}
        </form>

        {/* Live Running Status Banner */}
        {isRunning && (
          <div className="mt-5 p-4 bg-slate-900 text-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs shadow-md border border-slate-800 animate-in fade-in">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
              <span className="font-medium text-slate-200">{executionPhases[executionPhaseIndex]}</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 shrink-0">
              Active Loop
            </span>
          </div>
        )}
      </div>

      {/* Editorial Revisions Notice (if revised) */}
      {currentResult && currentResult.rejectionLogs.length > 0 && !isRunning && (
        <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 text-amber-950">
            <FileCheck2 className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Editorial Revisions:</strong> Draft 1 was flagged by the rubric evaluator and automatically refined in Draft #{currentResult.iterations.length}.
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('rejections')}
            className="px-3.5 py-1.5 bg-white border border-amber-300 hover:border-amber-400 text-amber-950 font-semibold rounded-xl text-xs shrink-0 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <span>View Review Notes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Published Lesson Presentation */}
      {currentResult && currentResult.shippedLesson && !isRunning && (
        <LessonReader
          lesson={currentResult.shippedLesson}
          evaluation={latestIteration?.evaluation}
          iterationNumber={currentResult.iterations.length}
          totalAttempts={currentResult.iterations.length}
        />
      )}
    </div>
  );
};
