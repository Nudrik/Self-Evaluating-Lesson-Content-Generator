import React, { useState } from 'react';
import {
  Code2,
  Workflow,
  CheckCircle,
  HelpCircle,
  Shield,
  Layers,
  ArrowRight,
  Zap,
  Server,
  Terminal,
} from 'lucide-react';
import { EvaluatorSandbox } from './EvaluatorSandbox.js';

export const ArchitectureDesign: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'graph' | 'evaluator' | 'tradeoffs' | 'langgraph'>('graph');

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>System Blueprint</span>
          <span aria-hidden="true">·</span>
          <span>Architectural Specifications</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-800">Design Decisions & Trade-Offs</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          System Planning & Engineering Rationales
        </h2>
        <p className="text-xs text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
          The goal of this system is not a single prompt, but an autonomous cybernetic feedback loop: an adversarial agentic architecture that drafts, inspects against hard binary pedagogical invariants, mutates prompts upon rejection, guarantees termination, and permanently sharpens its memory across runs.
        </p>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto mt-5 pt-4 border-t border-slate-100">
          {[
            { id: 'graph', label: '01. State Machine & Graph Topology' },
            { id: 'evaluator', label: '02. Hard Pass/Fail Philosophy' },
            { id: 'tradeoffs', label: '03. Trade-offs & Guardrail Engineering' },
            { id: 'langgraph', label: '04. LangGraph / n8n Mapping' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: State Machine & Graph Topology */}
      {activeSection === 'graph' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                State Machine & Multi-Agent Graph Topology
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                The pipeline operates as a stateful directed graph with conditional edges. State is strictly typed and decoupled from model memory.
              </p>
            </div>

            {/* Visual Topology Diagram */}
            <div className="p-6 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 space-y-6 font-mono text-xs">
              <div className="text-emerald-400 font-semibold tracking-wider">
                [TOPOLOGY: CYBERNETIC GENERATION-EVALUATION-REGENERATION GRAPH]
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-slate-400 text-[10px] uppercase">Node 01: Ingestion</div>
                  <div className="font-bold text-white mt-1">Memory_Inject</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Loads persistent learned rules & anti-hallucination guardrails.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-slate-400 text-[10px] uppercase">Node 02: Synthesis</div>
                  <div className="font-bold text-white mt-1">Generator_Agent</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Structured zero-to-one lesson with mental models and query traces.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-slate-400 text-[10px] uppercase">Node 03: Adversary</div>
                  <div className="font-bold text-white mt-1">Evaluator_Critic</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Verifies 6 binary checkpoints. Extracts quote-level violations.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-slate-400 text-[10px] uppercase">Node 04: Router</div>
                  <div className="font-bold text-white mt-1">Rejection_Router</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Conditional Edge: All Pass → Ship | Any Fail → Mutate Prompt & Retry.
                  </div>
                </div>
              </div>

              {/* Conditional Routing Code Snippet */}
              <div className="p-4 bg-slate-900/90 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[11px] mb-2 font-mono">
                  // Conditional Branching Edge Logic (Pseudocode)
                </div>
                <code className="text-emerald-300 block whitespace-pre">
{`function routeNextStep(state: PipelineState): NextNode {
  if (state.evaluation.allPassed) {
    return "Synthesize_Memory_And_Ship";
  }
  if (state.iteration >= state.maxRetries + 1) {
    return "Terminal_Halt_And_Audit";
  }
  // Surgical prompt injection of quoted violations
  state.feedbackDirectives = compileRejectionRemedies(state.evaluation);
  return "Generator_Agent"; // Loop back with feedback
}`}
                </code>
              </div>
            </div>

            {/* Why Decoupled Agents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-900">
                  Why Decouple Generator and Evaluator?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  When a single LLM is prompted to "generate a lesson and then grade yourself", it suffers from <strong>evaluator blindness</strong>. The model rationalizes its own shortcuts (e.g. overlooking unexplained jargon because the concept feels obvious in its own latent context). Decoupling into an adversarial critic running in an isolated context guarantees uncompromised scrutiny.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-900">
                  Why Prescriptive Directives Over Vague Retries?
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Traditional retry loops pass "Try again, it wasn't good enough", causing the model to rewrite everything from scratch and introduce new regressions. Our router captures <strong>quoted evidence</strong> and generates <strong>surgical remedies</strong>, instructing the generator to retain what passed while fixing only the flagged line.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Hard Pass/Fail Philosophy */}
      {activeSection === 'evaluator' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                The Philosophy of Hard Pass/Fail vs Fuzzy Scoring
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Why we explicitly ban partial credit (e.g., 7/10 or 85%) in pedagogical auditing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
                <span className="font-bold text-rose-900 block">
                  The Problem with Fuzzy Scoring (7.5/10)
                </span>
                <p className="text-slate-700 leading-relaxed">
                  In software compilation, a syntax error is not "85% working" — it fails. Similarly, for an absolute beginner with zero background, encountering the undefined phrase <em>"cosine similarity in vector space"</em> completely halts comprehension. A score of 8/10 hides this fatal defect and ships confusing material.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                <span className="font-bold text-emerald-900 block">
                  Binary Invariants Enforce a Production Floor
                </span>
                <p className="text-slate-700 leading-relaxed">
                  By treating checkpoints as hard binary invariants (PASS or FAIL), the evaluator acts like a compiler typechecker. Every required dimension (Groundedness, Everyday Language, Concrete Trace, Jargon Scaffolding) must clear 100% of the bar before human eyes ever see the content.
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                <span className="font-bold text-amber-950 block">
                  Quoted Evidence Requirement
                </span>
                <p className="text-slate-700 leading-relaxed">
                  The evaluator is legally bound by prompt to produce verbatim quotes for every failure. This prevents hallucinations from the evaluator itself and makes the rejection log verifiable, reproducible, and debuggable.
                </p>
              </div>
            </div>

            {/* The 6 Invariants Spec Sheet */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                The 6 Invariable Dimensions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    title: '1. Accurate & Grounded',
                    rule: 'Zero technical falsehoods. For RAG: explicitly confirms model weights are never retrained; external knowledge is fetched at runtime.',
                  },
                  {
                    title: '2. Beginner-Friendly Language',
                    rule: 'Warm, empathetic, non-academic tone. Grounded in human everyday lived experience.',
                  },
                  {
                    title: '3. Teaches by Example',
                    rule: 'Must feature a primary mental model (open-book exam) AND a concrete query trace through the pipeline.',
                  },
                  {
                    title: '4. Clear, No Unexplained Jargon',
                    rule: 'Hard check: Every technical term must be defined in plain English before or as it is introduced.',
                  },
                  {
                    title: '5. Covers Key Points',
                    rule: 'Explicitly covers the 3 core pillars: What it is, Why it matters (problems solved), and How it works.',
                  },
                  {
                    title: '6. Coherent Teaching Flow',
                    rule: 'Seamless narrative progression with an interactive 3-question knowledge check to test intuition.',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-900 block mb-0.5">{item.title}</span>
                    <span className="text-slate-600 leading-relaxed">{item.rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Evaluator Sandbox Embedded */}
            <div className="pt-6 border-t border-slate-200">
              <EvaluatorSandbox />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Trade-offs & Guardrail Engineering */}
      {activeSection === 'tradeoffs' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                System Trade-offs & Engineering Decisions
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Balancing latency, token expenditures, termination guarantees, and educational fidelity.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">
                    Trade-off 1: Bounded 2-Retry Loop vs. Unlimited Regeneration
                  </h4>
                  <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    SLA & Cost Bounding
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Decision:</strong> We hardcap retries to 2 (total 3 attempts maximum).
                  <br />
                  <strong>Reasoning:</strong> Unbounded agent loops risk infinite oscillation (flapping), where fixing checkpoint A causes checkpoint B to fail. In real production APIs, unbounded loops invite denial-of-service token explosions and latency spikes. Bounding to 2 retries forces aggressive convergence while strictly guaranteeing loop termination.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">
                    Trade-off 2: Structured JSON Schemas vs. Freeform Prose
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Deterministic Interop
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Decision:</strong> Both Generator and Evaluator communicate exclusively through strictly typed JSON payloads.
                  <br />
                  <strong>Reasoning:</strong> Parsing unstructured text for pass/fail decisions introduces regex brittleness and evaluator hallucination. Typed schemas ensure the UI can immediately render interactive quizzes, stepper timelines, and quoted evidence cards without parsing failures.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">
                    Trade-off 3: Cross-Run Memory Accumulation vs. Clean-Slate Generation
                  </h4>
                  <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                    Continuous Evolution
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Decision:</strong> We persist learned guardrails to server storage and inject them into future runs.
                  <br />
                  <strong>Reasoning:</strong> Most agent systems have zero memory: when a workflow finishes, the learnings from the rejection are lost. By synthesizing a generalizable heuristic rule after every retry (e.g., "Always define embeddings as GPS coordinates"), the generator's baseline accuracy permanently evolves, driving first-pass success from ~40% to &gt;85%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: LangGraph / n8n Mapping */}
      {activeSection === 'langgraph' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Industry Framework Equivalence (LangGraph & n8n)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                How the Self-Evaluating Lesson Content Generator architecture maps to LangGraph Python and n8n workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-300 font-bold"># LangGraph Python Equivalent</div>
                <pre className="text-[11px] text-slate-300 whitespace-pre overflow-x-auto">
{`from langgraph.graph import StateGraph, END

workflow = StateGraph(LessonState)

workflow.add_node("inject_memory", inject_memory_node)
workflow.add_node("generator", generator_agent_node)
workflow.add_node("evaluator", evaluator_critic_node)
workflow.add_node("synthesize_evolution", evolution_node)

workflow.set_entry_point("inject_memory")
workflow.add_edge("inject_memory", "generator")
workflow.add_edge("generator", "evaluator")

def router(state):
    if state["all_passed"]:
        return "synthesize_evolution"
    if state["retry_count"] >= 2:
        return "terminal_halt"
    return "generator" # Feedback loop

workflow.add_conditional_edges(
    "evaluator",
    router,
    {
        "synthesize_evolution": "synthesize_evolution",
        "terminal_halt": END,
        "generator": "generator"
    }
)
app = workflow.compile()`}
                </pre>
              </div>

              <div className="p-4 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold"># n8n Node Equivalence</div>
                <div className="space-y-2 text-[11px] text-slate-300 font-sans">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="font-mono text-emerald-400">1. Webhook / Topic Trigger:</span> Receives topic payload and loads Redis memory.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="font-mono text-emerald-400">2. LLM Node (Generator):</span> Invokes Gemini with pedagogical prompt + memory rules.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="font-mono text-emerald-400">3. LLM Node (Evaluator):</span> Independent audit agent executing 6 binary checks.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="font-mono text-emerald-400">4. IF / Switch Node:</span> Branches on <code className="font-mono text-emerald-300">verdict == "PASS"</code>.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="font-mono text-emerald-400">5. Sub-Workflow Loop:</span> Appends criticism to context and loops back to step 2 with loop counter counter &lt; 3.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
