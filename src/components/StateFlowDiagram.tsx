import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Cpu, ShieldCheck, Database, Award } from 'lucide-react';

interface StateFlowDiagramProps {
  currentStage: 'idle' | 'ingesting' | 'generating' | 'evaluating' | 'routing' | 'regenerating' | 'shipped' | 'halted';
  currentIteration?: number;
  maxRetries?: number;
  initialPassCount?: number;
  finalPassCount?: number;
  rejectionCount?: number;
}

export const StateFlowDiagram: React.FC<StateFlowDiagramProps> = ({
  currentStage,
  currentIteration = 1,
  maxRetries = 2,
  initialPassCount,
  finalPassCount,
  rejectionCount = 0,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes = [
    {
      id: 'memory',
      title: 'Memory Injection',
      role: 'System Pre-Condition',
      icon: Database,
      desc: 'Retrieves active learned guardrails & prior failure patterns to prevent recurring mistakes.',
      isActive: currentStage === 'ingesting',
      isCompleted: currentStage !== 'idle' && currentStage !== 'ingesting',
    },
    {
      id: 'generator',
      title: 'Generator Agent',
      role: 'Instructional Designer',
      icon: Cpu,
      desc: 'Synthesizes beginner lesson with mental models, what/why/how scaffolding, query trace, and quiz.',
      isActive: currentStage === 'generating' || currentStage === 'regenerating',
      isCompleted: ['evaluating', 'routing', 'shipped'].includes(currentStage),
    },
    {
      id: 'evaluator',
      title: 'Evaluator Critic',
      role: 'Uncompromising Auditor',
      icon: ShieldCheck,
      desc: 'Judges lesson against 6 strict binary pass/fail checkpoints with verbatim quoted evidence.',
      isActive: currentStage === 'evaluating',
      isCompleted: ['routing', 'shipped'].includes(currentStage),
    },
    {
      id: 'router',
      title: 'Rejection Router',
      role: 'Control Node',
      icon: RefreshCw,
      desc: 'Checks pass/fail verdict. On failure within budget, extracts violations into targeted prompt directives.',
      isActive: currentStage === 'routing',
      isCompleted: currentStage === 'shipped' || currentStage === 'regenerating',
    },
    {
      id: 'shipped',
      title: 'Shipped & Evolved',
      role: 'Terminal State',
      icon: Award,
      desc: 'Delivers audited lesson to learner and synthesizes new permanent memory rule from failure log.',
      isActive: currentStage === 'shipped',
      isCompleted: currentStage === 'shipped',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800 tracking-wider uppercase">
              Agentic State Machine
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Autonomous Generate-Evaluate-Regenerate Loop</span>
          </div>
          <h2 className="text-base font-semibold text-slate-900 mt-0.5">
            Pipeline Orchestration Graph
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div>
            <span className="text-slate-600">Attempt:</span>{' '}
            <span className="font-semibold text-slate-900 font-mono">
              {currentIteration} / {maxRetries + 1}
            </span>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-600">Rejections:</span>{' '}
            <span className="font-semibold text-rose-600 font-mono">
              {rejectionCount}
            </span>
          </div>
          {finalPassCount !== undefined && (
            <>
              <span className="text-slate-300">·</span>
              <div>
                <span className="text-slate-600">Checkpoints Passed:</span>{' '}
                <span className="font-semibold text-emerald-600 font-mono">
                  {finalPassCount} / 6
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Graph Nodes Visual Strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-5">
        {nodes.map((node, idx) => {
          const Icon = node.icon;
          const isSelected = selectedNode === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
              className={`cursor-pointer rounded-lg p-3.5 border transition-all text-left relative ${
                node.isActive
                  ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-300'
                  : node.isCompleted
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  : 'bg-white border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center ${
                    node.isActive
                      ? 'bg-slate-900 text-white animate-pulse'
                      : node.isCompleted
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono text-slate-600">0{idx + 1}</span>
              </div>

              <div className="text-xs font-semibold text-slate-900 leading-snug">
                {node.title}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                {node.role}
              </div>

              {idx < 4 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded Node Deep-Dive Inspection */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">
              {nodes.find((n) => n.id === selectedNode)?.title} Component Details
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-600 hover:text-slate-700"
            >
              Close
            </button>
          </div>
          <p className="text-slate-600 mt-1.5 leading-relaxed">
            {nodes.find((n) => n.id === selectedNode)?.desc}
          </p>
        </div>
      )}
    </div>
  );
};
