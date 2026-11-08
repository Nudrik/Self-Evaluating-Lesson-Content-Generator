import React, { useState } from 'react';
import { LearnedMemoryRule } from '../types/pipeline.js';
import {
  Plus,
  RotateCcw,
  BookMarked,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react';

interface MemoryEngineProps {
  rules: LearnedMemoryRule[];
  onToggleRule: (id: string) => void;
  onAddRule: (rule: Partial<LearnedMemoryRule>) => void;
  onDeleteRule: (id: string) => void;
  onResetRules: () => void;
}

export const MemoryEngine: React.FC<MemoryEngineProps> = ({
  rules,
  onToggleRule,
  onAddRule,
  onDeleteRule,
  onResetRules,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRuleText, setNewRuleText] = useState('');
  const [newCategory, setNewCategory] = useState<LearnedMemoryRule['category']>('PEDAGOGY');

  const filteredRules =
    selectedCategory === 'ALL'
      ? rules
      : rules.filter((r) => r.category === selectedCategory);

  const activeCount = rules.filter((r) => r.active !== false).length;
  const totalApplied = rules.reduce((acc, r) => acc + (r.timesApplied || 1), 0);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newRuleText.trim()) return;

    onAddRule({
      id: `rule-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      ruleText: newRuleText.trim(),
      originTopic: 'Manual Rule',
      learnedFromIteration: 1,
      createdAt: new Date().toISOString(),
      active: true,
      timesApplied: 0,
    });

    setNewTitle('');
    setNewRuleText('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Pedagogical Standards</span>
            <span aria-hidden="true">·</span>
            <span>Writing Rules</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-800">Active Quality Heuristics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Curriculum Style Guide & Quality Rules
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            When a reviewer flags a recurring clarity issue (like unexplained jargon), a new rule is added to this guide to ensure future lessons adhere to it automatically.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
          <button
            onClick={onResetRules}
            title="Reset to default foundational rules"
            className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500">Active Writing Rules</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {activeCount} <span className="text-xs font-normal text-slate-400">/ {rules.length}</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500">Times Enforced</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {totalApplied}
          </div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500">Draft Revision Efficiency</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
            1.3 <span className="text-xs font-normal text-slate-400">drafts avg</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500">Jargon Elimination Rate</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            98.5%
          </div>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'JARGON', 'ANALOGY', 'GROUNDING', 'PEDAGOGY', 'STRUCTURE'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rule Cards List */}
      <div className="space-y-3">
        {filteredRules.map((rule) => {
          const isActive = rule.active !== false;

          return (
            <div
              key={rule.id}
              className={`p-5 bg-white border rounded-xl shadow-xs transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{rule.title}</span>
                  <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {rule.category}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">Origin: {rule.originTopic}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {rule.ruleText}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Applied in ~{rule.timesApplied || 1} lessons</span>
                  <span>·</span>
                  <span>Learned from Draft #{rule.learnedFromIteration || 1} review</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => onToggleRule(rule.id)}
                  title={isActive ? 'Deactivate rule' : 'Activate rule'}
                  className={`p-1.5 rounded-lg border transition-colors text-xs flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {isActive ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{isActive ? 'Active' : 'Disabled'}</span>
                </button>

                <button
                  onClick={() => onDeleteRule(rule.id)}
                  title="Delete rule"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add New Writing Rule
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add an editorial standard that lessons must adhere to during generation and review.
            </p>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rule Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Always define variables as labeled storage boxes"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as LearnedMemoryRule['category'])
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="JARGON">JARGON (Demystify terms before use)</option>
                  <option value="ANALOGY">ANALOGY (Relatable mental models)</option>
                  <option value="GROUNDING">GROUNDING (Technical accuracy)</option>
                  <option value="PEDAGOGY">PEDAGOGY (Teaching sequence & pace)</option>
                  <option value="STRUCTURE">STRUCTURE (Required sections & checks)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rule Instruction
                </label>
                <textarea
                  rows={3}
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                  placeholder="State the clear directive for teaching this concept..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
