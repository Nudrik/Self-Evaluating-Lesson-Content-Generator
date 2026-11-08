import React, { useState, useEffect } from 'react';
import {
  PipelineExecutionResult,
  LearnedMemoryRule,
} from './types/pipeline.js';
import { SAMPLE_RAG_RUN } from './data/sampleRuns.js';
import { Header, ActiveTab } from './components/Header.js';
import { PipelineStudio } from './components/PipelineStudio.js';
import { RejectionLogViewer } from './components/RejectionLogViewer.js';
import { MemoryEngine } from './components/MemoryEngine.js';
import { ArchitectureDesign } from './components/ArchitectureDesign.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [currentResult, setCurrentResult] = useState<PipelineExecutionResult | null>(SAMPLE_RAG_RUN);
  const [memoryRules, setMemoryRules] = useState<LearnedMemoryRule[]>(SAMPLE_RAG_RUN.synthesizedRules || []);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);

  // Fetch memory rules on mount
  useEffect(() => {
    fetch('/api/memory')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch memory');
      })
      .then((data) => {
        if (data && data.rules) {
          setMemoryRules(data.rules);
        }
      })
      .catch((err) => {
        console.warn('Memory fetch note:', err);
      });
  }, []);

  // Run the full agentic loop
  const handleRunPipeline = async (topic: string, forceStrictFirst: boolean) => {
    setIsRunning(true);
    setErrorNotification(null);

    try {
      const res = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          learnerLevel: 'Absolute Beginner (Starts from Zero)',
          maxRetries: 2,
          forceStrictRejectionFirst: forceStrictFirst,
          activeMemoryRules: memoryRules,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Execution failed with status ${res.status}`);
      }

      const result: PipelineExecutionResult = await res.json();
      setCurrentResult(result);

      // Re-fetch updated memory rules
      const memRes = await fetch('/api/memory');
      if (memRes.ok) {
        const memData = await memRes.json();
        if (memData.rules) {
          setMemoryRules(memData.rules);
        }
      }
    } catch (err: any) {
      console.error('Pipeline error:', err);
      setErrorNotification(err.message || 'Execution failed. Please check network/API status.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleToggleRule = async (id: string) => {
    try {
      const res = await fetch(`/api/memory/rule/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        setMemoryRules(data.rules);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRule = async (rule: Partial<LearnedMemoryRule>) => {
    try {
      const res = await fetch('/api/memory/rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule }),
      });
      if (res.ok) {
        const data = await res.json();
        setMemoryRules(data.rules);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      const res = await fetch(`/api/memory/rule/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setMemoryRules(data.rules);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetRules = async () => {
    try {
      const res = await fetch('/api/memory/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setMemoryRules(data.rules);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-slate-200 selection:text-slate-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isRunning={isRunning}
      />

      {/* Error notification banner */}
      {errorNotification && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center justify-between">
            <span>{errorNotification}</span>
            <button
              onClick={() => setErrorNotification(null)}
              className="text-rose-600 font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'studio' && (
          <PipelineStudio
            currentResult={currentResult}
            onRunPipeline={handleRunPipeline}
            isRunning={isRunning}
            activeMemoryRules={memoryRules}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'rejections' && (
          <RejectionLogViewer
            iterations={currentResult?.iterations || []}
            rejectionLogs={currentResult?.rejectionLogs || []}
            topic={currentResult?.topic || 'Introduction to RAG'}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryEngine
            rules={memoryRules}
            onToggleRule={handleToggleRule}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
            onResetRules={handleResetRules}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureDesign />}
      </main>

      {/* Quiet Footer adhering to anti-slop rules */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>Self-Evaluating Lesson Content Generator</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Agentic Quality Gate</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-slate-900 transition-colors"
            >
              System Blueprint
            </button>
            <button
              onClick={() => setActiveTab('rejections')}
              className="hover:text-slate-900 transition-colors"
            >
              Rejection Logs
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className="hover:text-slate-900 transition-colors"
            >
              Agent Memory
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
