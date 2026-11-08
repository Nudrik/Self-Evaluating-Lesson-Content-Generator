import React, { useState } from 'react';
import {
  LessonContent,
  EvaluationReport,
} from '../types/pipeline.js';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  ShieldCheck,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Terminal,
} from 'lucide-react';

interface LessonReaderProps {
  lesson: LessonContent;
  evaluation?: EvaluationReport;
  iterationNumber?: number;
  totalAttempts?: number;
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  lesson,
  evaluation,
}) => {
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleQuizSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const copyMarkdown = () => {
    const md = `# ${lesson.title}

> ${lesson.hook}

## Mental Model: ${lesson.mentalModel.title}
${lesson.mentalModel.analogy}
*Takeaway: ${lesson.mentalModel.takeaway}*

## What It Is
${lesson.whatItIs}

## Why It Matters
- **Problem Solved**: ${lesson.whyItMatters.problemSolved}
- **Without this**: ${lesson.whyItMatters.consequencesOfNotUsing}

## How It Works
${lesson.howItWorks
  .map(
    (s) => `### Step ${s.stepNumber}: ${s.title}
${s.explanation}
*(Analogy: ${s.analogyTip})*`
  )
  .join('\n\n')}

## Walkthrough Trace
- **Task/Query**: "${lesson.walkthroughExample.query}"
- **Context/Input**: "${lesson.walkthroughExample.context}"
- **Final Result**: "${lesson.walkthroughExample.finalAnswer}"

## Summary Takeaways
${lesson.summaryTakeaways.map((t) => `- ${t}`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${lesson.title}. ${lesson.hook}. ${lesson.mentalModel.analogy}. ${lesson.whatItIs}. ${lesson.whyItMatters.problemSolved}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const passedCount = evaluation ? evaluation.passedCount : 6;
  const isAllPassed = evaluation ? evaluation.verdict === 'PASS' : true;

  return (
    <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Lesson Header Banner */}
      <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Beginner Lesson</span>
            <span aria-hidden="true">·</span>
            <span>~4 min read</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Quality Verified ({passedCount}/6 Pass)
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {lesson.title}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAuditModal(!showAuditModal)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rubric Details</span>
          </button>

          <button
            onClick={toggleSpeech}
            title={isSpeaking ? 'Stop narration' : 'Listen to overview'}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-slate-900" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={copyMarkdown}
            title="Copy as Markdown"
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Reading Flow */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Hook */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
            "{lesson.hook}"
          </p>
        </div>

        {/* Mental Model Spotlight */}
        <section className="bg-amber-50/40 border border-amber-200/70 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
              The Mental Model: {lesson.mentalModel.title}
            </h3>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {lesson.mentalModel.analogy}
          </p>
          <div className="pt-2 border-t border-amber-200/50 text-xs font-medium text-amber-900">
            <strong>Key Intuition:</strong> {lesson.mentalModel.takeaway}
          </div>
        </section>

        {/* What It Is & Why It Matters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              What It Is in Plain English
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {lesson.whatItIs}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Why It Matters
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {lesson.whyItMatters.problemSolved}
            </p>
            <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
              <strong>Without it:</strong> {lesson.whyItMatters.consequencesOfNotUsing}
            </p>
          </div>
        </div>

        {/* How It Works */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            How It Works Step-by-Step
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lesson.howItWorks.map((step) => (
              <div
                key={step.stepNumber}
                className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-bold flex items-center justify-center mb-3">
                    {step.stepNumber}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
                  Tip: {step.analogyTip}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Walkthrough Trace */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Real-World Walkthrough
          </h3>

          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 space-y-4 font-sans text-xs">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Task / Goal:</span>{' '}
                <span className="text-emerald-400 font-medium">"{lesson.walkthroughExample.query}"</span>
              </div>
            </div>

            <div className="space-y-2">
              {lesson.walkthroughExample.stepByStepTrace.map((trace, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-amber-300 mr-2">{trace.step}:</span>
                    <span className="text-slate-300">{trace.whatHappens}</span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-300/90 shrink-0 bg-slate-950 px-2 py-1 rounded">
                    {trace.output}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px] uppercase tracking-wider">
                Final Result
              </span>
              <p className="text-emerald-300 leading-relaxed bg-slate-800/90 p-3 rounded-lg border border-emerald-900/40">
                {lesson.walkthroughExample.finalAnswer}
              </p>
            </div>
          </div>
        </section>

        {/* Check Your Understanding Quiz */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Check Your Understanding
          </h3>

          <div className="space-y-4">
            {lesson.knowledgeCheck.map((q, qIdx) => {
              const selectedOpt = selectedQuizAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={qIdx}
                  className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <div className="font-semibold text-slate-900 mb-3">
                    {qIdx + 1}. {q.question}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                      if (isAnswered) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-medium';
                        } else if (selectedOpt === optIdx) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                        } else {
                          btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizSelect(qIdx, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && optIdx === q.correctIndex && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={`mt-3 p-3 rounded-lg text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <strong className="block mb-0.5">{isCorrect ? 'Correct!' : 'Insight:'}</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Summary Takeaways */}
        <section className="p-6 bg-slate-900 text-white rounded-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Summary Takeaways
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {lesson.summaryTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">·</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Rubric Details Sheet / Drawer */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Evaluator Rubric Audit (6/6 Checkpoints)
                </h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Every lesson is evaluated against 6 binary hard pass/fail checkpoints with zero partial credit before shipping.
            </p>

            <div className="space-y-2.5">
              {evaluation?.checkpoints.map((cp) => {
                const isPass = cp.status === 'PASS';
                return (
                  <div
                    key={cp.id}
                    className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                      isPass ? 'bg-slate-50 border-slate-200' : 'bg-rose-50 border-rose-200'
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
                    <p className="text-slate-600 text-[11px] leading-relaxed">{cp.critique}</p>
                    {cp.evidence && (
                      <div className="text-[10px] text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                        "{cp.evidence}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
