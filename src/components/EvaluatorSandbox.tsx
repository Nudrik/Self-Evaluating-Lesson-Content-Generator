import React, { useState } from 'react';
import { EvaluationReport } from '../types/pipeline.js';
import { ShieldCheck, AlertTriangle, Play, CheckCircle2, XCircle } from 'lucide-react';

export const EvaluatorSandbox: React.FC = () => {
  const [topic, setTopic] = useState('Introduction to RAG');
  const [customDraft, setCustomDraft] = useState(`RAG Explained for Beginners:
RAG stands for Retrieval-Augmented Generation. Imagine taking an open-book exam: instead of memorizing everything, you look up the right page before answering.
In RAG, your documents are split into chunks. Each chunk is given an embedding — which is just a set of GPS coordinates for meaning so similar ideas sit close together.
When a user asks "Can I return opened headphones?", the system retrieves Section 4.2 of the customer policy and hands it to the AI.
The AI reads the rule and answers truthfully: "Yes, within 14 days."
RAG never alters model weights; it simply feeds reference notes into the prompt.`);

  const [isRunning, setIsRunning] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    {
      label: 'Passing Draft (Clean & Grounded)',
      topic: 'Introduction to RAG',
      text: `RAG Explained for Beginners:
RAG stands for Retrieval-Augmented Generation. Imagine taking an open-book exam: instead of memorizing everything, you look up the right page before answering.
In RAG, your documents are split into chunks. Each chunk is given an embedding — which is just a set of GPS coordinates for meaning so similar ideas sit close together.
When a user asks "Can I return opened headphones?", the system retrieves Section 4.2 of the customer policy and hands it to the AI.
The AI reads the rule and answers truthfully: "Yes, within 14 days."
RAG never alters model weights; it simply feeds reference notes into the prompt.`,
    },
    {
      label: 'Failing Draft (Unexplained Jargon)',
      topic: 'Introduction to RAG',
      text: `RAG is an AI pipeline.
It takes documents and embeds them into a high-dimensional latent vector space using dense passage retrieval.
When the user queries the index, it calculates cosine similarity between the query embedding and document centroids.
Then it generates text.`,
    },
    {
      label: 'Failing Draft (Factually Misleading: Claims Weight Tuning)',
      topic: 'Introduction to RAG',
      text: `RAG is an amazing technique that permanently retrains the neural network weights of the model every time a PDF is uploaded.
The AI updates its internal parameters and fine-tunes itself instantly.`,
    },
  ];

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    setError(null);
    setEvaluationReport(null);

    try {
      // Create a pseudo-lesson object from custom text
      const pseudoLesson = {
        topic,
        title: topic,
        hook: customDraft.slice(0, 120),
        mentalModel: {
          title: 'Primary Metaphor',
          analogy: customDraft,
          takeaway: 'Core takeaway',
        },
        whatItIs: customDraft,
        whyItMatters: {
          problemSolved: 'Solves hallucinations and static memory',
          consequencesOfNotUsing: 'Confabulation',
        },
        howItWorks: [
          {
            stepNumber: 1,
            title: 'Pipeline Flow',
            explanation: customDraft,
            analogyTip: 'Analogy tip',
          },
        ],
        walkthroughExample: {
          query: 'Sample user question',
          context: 'Reference snippet',
          stepByStepTrace: [
            {
              step: 'Step 1: Trace',
              whatHappens: customDraft,
              output: 'Output snippet',
            },
          ],
          finalAnswer: 'Output response',
        },
        knowledgeCheck: [
          {
            question: 'Check question',
            options: ['Option 1', 'Option 2'],
            correctIndex: 0,
            explanation: 'Reason',
          },
        ],
        summaryTakeaways: ['Takeaway 1', 'Takeaway 2'],
      };

      const res = await fetch('/api/pipeline/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson: pseudoLesson, forceStrict: true }),
      });

      if (!res.ok) {
        throw new Error(`Evaluation failed with status: ${res.status}`);
      }

      const report: EvaluationReport = await res.json();
      setEvaluationReport(report);
    } catch (err: any) {
      setError(err.message || 'Evaluation request failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Interactive Diagnostic Sandbox</span>
          <span aria-hidden="true">·</span>
          <span>Adversarial Critic Testing</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-800">6 Hard Pass/Fail Dimensions</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mt-1">
          Evaluator Critic Sandbox
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Test the Evaluator Agent independently. Paste any draft lesson, select a test scenario, and observe how the uncompromising binary pass/fail rubric catches jargon, factual drift, or missing walkthroughs.
        </p>

        {/* Preset Selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopic(preset.topic);
                setCustomDraft(preset.text);
                setEvaluationReport(null);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors whitespace-nowrap"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Run Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              Draft Content to Evaluate
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {customDraft.length} chars
            </span>
          </div>

          <textarea
            rows={12}
            value={customDraft}
            onChange={(e) => setCustomDraft(e.target.value)}
            placeholder="Paste draft lesson text here..."
            className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed text-slate-800"
          />

          <button
            onClick={handleRunEvaluation}
            disabled={isRunning || !customDraft.trim()}
            className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {isRunning ? (
              <span>Auditing Draft Invariants...</span>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run Hard Pass/Fail Evaluation</span>
              </>
            )}
          </button>
        </div>

        {/* Evaluation Output Deck */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">
              Auditor Verdict & Checkpoint Breakdown
            </span>
            {evaluationReport && (
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  evaluationReport.verdict === 'PASS'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {evaluationReport.verdict === 'PASS' ? 'SHIP APPROVED' : 'REJECTED'}
              </span>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
              {error}
            </div>
          )}

          {!evaluationReport && !isRunning && !error && (
            <div className="p-8 text-center text-xs text-slate-400">
              Click "Run Hard Pass/Fail Evaluation" to see the auditor's line-by-line inspection.
            </div>
          )}

          {isRunning && (
            <div className="p-8 text-center text-xs text-slate-700 animate-pulse">
              Auditor is inspecting text against 6 hard invariants...
            </div>
          )}

          {evaluationReport && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 font-medium">
                Passed: <strong className="text-slate-900">{evaluationReport.passedCount}</strong> / {evaluationReport.totalCount} checkpoints
              </div>

              {evaluationReport.rejectionSummary && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
                  <span className="font-semibold block mb-0.5">Rejection Summary:</span>
                  {evaluationReport.rejectionSummary}
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {evaluationReport.checkpoints.map((cp) => {
                  const isPass = cp.status === 'PASS';
                  return (
                    <div
                      key={cp.id}
                      className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                        isPass ? 'bg-slate-50 border-slate-200' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{cp.title}</span>
                        <span
                          className={`font-mono font-bold ${
                            isPass ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {cp.status}
                        </span>
                      </div>
                      <p className="text-slate-600">{cp.critique}</p>
                      {cp.evidence && (
                        <div className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded border border-slate-200/60">
                          Evidence: "{cp.evidence}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
