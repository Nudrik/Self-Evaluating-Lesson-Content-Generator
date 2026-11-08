import React, { useState } from 'react';
import {
  IterationRecord,
  RejectionLogItem,
} from '../types/pipeline.js';
import {
  History,
  GitCompare,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface RejectionLogViewerProps {
  iterations: IterationRecord[];
  rejectionLogs: RejectionLogItem[];
  topic: string;
}

export const RejectionLogViewer: React.FC<RejectionLogViewerProps> = ({
  iterations,
  rejectionLogs,
  topic,
}) => {
  const [selectedIterationIndex, setSelectedIterationIndex] = useState<number>(0);
  const [compareMode, setCompareMode] = useState(false);

  if (iterations.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 max-w-4xl mx-auto">
        <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">No Review History Yet</h3>
        <p className="text-xs text-slate-500 mt-1">
          Generate a lesson in the Studio to view editorial review notes and revision history.
        </p>
      </div>
    );
  }

  const currentIter = iterations[selectedIterationIndex] || iterations[0];
  const iter1 = iterations[0];
  const iter2 = iterations[1];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Editorial Review Notes</span>
            <span aria-hidden="true">·</span>
            <span>Topic: {topic}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700 font-medium">
              {iterations.length} Draft{iterations.length > 1 ? 's' : ''} Reviewed
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Revision History & Standards Review
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Reviewers inspect every draft against 6 hard standards. Any flagged clarity or terminology issue is refined before publishing.
          </p>
        </div>

        {iterations.length > 1 && (
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              compareMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{compareMode ? 'Single Draft View' : 'Side-by-Side Comparison'}</span>
          </button>
        )}
      </div>

      {/* Side-by-Side Comparison Mode */}
      {compareMode && iter1 && iter2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Draft 1 Card */}
          <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Draft 1 (Flagged for Revisions)
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                  {iter1.lesson.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {iter1.evaluation.passedCount}/6 Standards Met
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-800 block mb-1">
                Flagged Step Explanation:
              </span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                "{iter1.lesson.howItWorks[0]?.explanation}"
              </p>
              <div className="text-xs text-rose-800 mt-1.5 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                <span>Reviewer: Technical terms were introduced without a plain-English explanation for beginners.</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-800 block mb-1">
                Walkthrough Details:
              </span>
              <div className="space-y-1.5 text-xs">
                {iter1.lesson.walkthroughExample.stepByStepTrace.map((st, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800">{st.step}:</span>{' '}
                    <span className="text-slate-600">{st.whatHappens}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-rose-800 mt-1.5 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                <span>Reviewer: The walkthrough was too abstract and lacked concrete intermediate detail.</span>
              </div>
            </div>
          </div>

          {/* Draft 2 Card */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Draft 2 (Approved & Ready to Ship)
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                  {iter2.lesson.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {iter2.evaluation.passedCount}/6 Standards Met (100%)
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-800 block mb-1">
                Revised with Everyday Analogy:
              </span>
              <p className="text-xs text-slate-800 bg-emerald-50/40 p-3 rounded-lg border border-emerald-200">
                "{iter2.lesson.howItWorks[0]?.explanation}"
              </p>
              <div className="text-xs text-emerald-800 mt-1.5 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                <span>Reviewer: Grounded abstract terms using intuitive analogies before use.</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-800 block mb-1">
                Concrete Step-by-Step Walkthrough:
              </span>
              <div className="space-y-1.5 text-xs">
                {iter2.lesson.walkthroughExample.stepByStepTrace.map((st, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800">{st.step}:</span>{' '}
                    <span className="text-slate-600">{st.whatHappens}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-emerald-800 mt-1.5 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                <span>Reviewer: Full clarity with concrete input, intermediate actions, and final result.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Single Draft Stepper View */
        <div className="space-y-6">
          {/* Draft Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {iterations.map((iter, idx) => {
              const isSelected = selectedIterationIndex === idx;
              const isPass = iter.evaluation.verdict === 'PASS';

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIterationIndex(idx)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all text-left flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPass ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span>Draft {iter.iteration}</span>
                  <span className="text-[11px] opacity-75 font-mono">
                    ({iter.evaluation.passedCount}/6 Met)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Draft Inspection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Review Stage #{currentIter.iteration}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {currentIter.lesson.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    currentIter.evaluation.verdict === 'PASS'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {currentIter.evaluation.verdict === 'PASS' ? 'APPROVED' : 'REVISIONS REQUIRED'}
                </span>
              </div>
            </div>

            {/* Injected Directives */}
            {currentIter.criticFeedbackFedForward && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Reviewer Guidance Injected into This Revision</span>
                </div>
                <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-slate-200">
                  {currentIter.criticFeedbackFedForward}
                </pre>
              </div>
            )}

            {/* Checkpoint Standards Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pedagogical Standards Breakdown
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentIter.evaluation.checkpoints.map((cp) => {
                  const isPass = cp.status === 'PASS';
                  return (
                    <div
                      key={cp.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        isPass
                          ? 'bg-slate-50/70 border-slate-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{cp.title}</span>
                        <span
                          className={`font-mono font-bold text-[11px] ${
                            isPass ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {cp.status}
                        </span>
                      </div>
                      <div className="text-slate-600 leading-relaxed">{cp.critique}</div>
                      {cp.evidence && (
                        <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 italic">
                          "{cp.evidence}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
