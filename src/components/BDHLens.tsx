'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

/**
 * BDHLens component.
 *
 * Implements the educational module: "From Fast Weights to Synapses: The BDH Lens".
 * Strictly distinguishes published BDH primary-source facts from educational abstractions.
 * Connects outer-product fast-weight associative memory to BDH's dynamic synaptic plasticity.
 */
export function BDHLens() {
  return (
    <section
      className="bg-surface rounded-lg border border-border p-5 sm:p-6 space-y-6"
      aria-labelledby="bdh-lens-heading"
    >
      {/* 1. Header with Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              Comparative Architecture Lens
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-accent/15 text-accent border border-accent/30 font-semibold">
              EDUCATIONAL ABSTRACTION
            </span>
          </div>
          <h2
            id="bdh-lens-heading"
            className="text-xl sm:text-2xl font-bold text-foreground mt-1 tracking-tight"
          >
            From Fast Weights to Synapses: The BDH Lens
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            How linear associative memory connects conceptually to published inference-time synaptic plasticity in Dragon Hatchling (BDH)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start">
          <a
            href="https://arxiv.org/abs/2509.26507"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-2 border border-border hover:border-accent text-xs font-mono text-foreground transition-colors"
          >
            <span>BDH (arXiv:2509.26507)</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://arxiv.org/abs/2608.09888"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-2 border border-border hover:border-accent text-xs font-mono text-foreground transition-colors"
          >
            <span>BDH-CQ (arXiv:2608.09888)</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* 2. Educational Objective */}
      <div className="bg-surface-2/60 rounded-lg border border-border p-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold mb-2">
          Primary Learning Objective
        </h3>
        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
          Understand how a bounded associative state relates to biological and neuromorphic models of memory. Our toy simulator isolates outer-product fast weights; the published <strong>Dragon Hatchling (BDH)</strong> architecture exemplifies how dynamic working memory can be implemented during inference via synaptic plasticity and sparse Hebbian updates.
        </p>
      </div>

      {/* 3. Published BDH Facts vs Educational Abstraction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Published Facts */}
        <div className="bg-surface-2 rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-success font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" />
              PUBLISHED BDH FACTS
            </h4>
            <span className="text-[10px] font-mono text-muted">arXiv:2509.26507</span>
          </div>
          <ul className="space-y-2 text-xs text-foreground/90 leading-relaxed list-disc list-inside marker:text-success">
            <li>
              <strong>Scale-Free Graph:</strong> BDH is founded on a biologically inspired network of locally interacting neuron particles.
            </li>
            <li>
              <strong>Dual Formulations:</strong> Operates via both a particle graph representation and a parallel GPU-friendly matrix formulation.
            </li>
            <li>
              <strong>Synaptic Working Memory:</strong> Inference-time working memory relies on synaptic plasticity with local Hebbian learning.
            </li>
            <li>
              <strong>Observed Specialization:</strong> Empirical tests demonstrated that specific synapses strengthen when concepts are processed.
            </li>
            <li>
              <strong>Sparse Positive State:</strong> Activations are non-negative and highly sparse, unlike dense unconstrained activations.
            </li>
          </ul>
        </div>

        {/* Not Mamba SSM Classification */}
        <div className="bg-surface-2 rounded-lg border border-border p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-warning font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-warning" />
                ARCHITECTURAL CLASSIFICATION
              </h4>
              <span className="text-[10px] font-mono text-muted">Crucial Distinction</span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed">
              <strong>BDH is not a Mamba-style SSM:</strong> While BDH provides a GPU-efficient formulation that relates attention to an evolving synaptic memory, it is fundamentally distinct from selective state space models (SSMs) like Mamba.
            </p>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Mamba uses continuous 1D SSM parameterizations discretized over sequence steps. In contrast, BDH models inference-time working memory as dynamic synaptic connectivity modulated by local Hebbian plasticity.
            </p>
          </div>
          <div className="pt-2 border-t border-border/60 text-[11px] font-mono text-muted">
            Status: Distinct mechanism (synaptic graph / fast weights vs. linear state space)
          </div>
        </div>
      </div>

      {/* 4. Side-by-Side Comparison: Our Toy vs BDH Concept */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted">
          Conceptual Mapping: Associative Memory to BDH Synaptic State
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Our Toy */}
          <div className="bg-surface-2 rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-accent uppercase">
                Our Educational Toy Model
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                LIVE TOY COMPUTATION
              </span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-foreground/90">
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Presynaptic cue: </span>
                <span className="text-ground-truth font-semibold">Key vector k_t ∈ R^d</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Postsynaptic response: </span>
                <span className="text-retrieved font-semibold">Value vector v_t ∈ R^d</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Associative memory: </span>
                <span className="text-foreground font-semibold">Matrix M_t ∈ R^(d×d)</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Memory write: </span>
                <span className="text-cross-talk font-semibold">Outer product v_t k_t^T</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Retrieval: </span>
                <span className="text-foreground font-semibold">v̂ = M q</span>
              </div>
            </div>
          </div>

          {/* BDH Concept */}
          <div className="bg-surface-2 rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-success uppercase">
                BDH Architecture Concept
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-success/15 text-success border border-success/30">
                PUBLISHED BDH CONCEPT
              </span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-foreground/90">
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Presynaptic activity: </span>
                <span className="text-ground-truth font-semibold">Incoming sparse activation x_t</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Postsynaptic activity: </span>
                <span className="text-retrieved font-semibold">Neuron firing response y_t</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Synaptic state: </span>
                <span className="text-foreground font-semibold">Dynamic synaptic matrix / weights</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Synaptic update: </span>
                <span className="text-cross-talk font-semibold">Hebbian plasticity (ΔW ∝ x ⊗ y)</span>
              </div>
              <div className="p-2 rounded bg-surface border border-border/60">
                <span className="text-muted">Inference propagation: </span>
                <span className="text-foreground font-semibold">Synaptic interaction + read-out</span>
              </div>
            </div>
          </div>
        </div>

        {/* Essential Disclaimers */}
        <div className="bg-surface-2/80 border-l-4 border-accent p-3.5 rounded-r text-xs text-foreground/90 leading-relaxed font-medium">
          Both involve state that changes during inference, but the implementations and mathematical structures are different.
        </div>
      </div>

      {/* 5. Mathematical Formulations: Toy vs Conceptual Hebbian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-2 rounded-lg border border-border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground">Toy Additive Rule</h4>
            <span className="text-[10px] font-mono text-muted">Direct Matrix Write</span>
          </div>
          <div className="p-2.5 bg-surface rounded border border-border/50 text-center overflow-x-auto">
            <BlockMath math={"M_t = M_{t-1} + v_t k_t^\\top"} />
          </div>
          <p className="text-[11px] text-muted leading-normal">
            Directly increments a dense <InlineMath math="d \times d" /> state with the unconstrained outer product of input vectors.
          </p>
        </div>

        <div className="bg-surface-2 rounded-lg border border-border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground">Hebbian Conceptual Form</h4>
            <span className="text-[10px] font-mono text-muted">Biological Inspiration</span>
          </div>
          <div className="p-2.5 bg-surface rounded border border-border/50 text-center overflow-x-auto">
            <BlockMath math={"\\Delta \\text{synapse}_{ij} \\propto \\text{pre}_j \\times \\text{post}_i"} />
          </div>
          <p className="text-[11px] text-muted leading-normal">
            Hebbian conceptual form: &ldquo;neurons that fire together wire together&rdquo;. In actual BDH, activations are positive, sparse, and modulated by scale-free network topology.
          </p>
        </div>
      </div>

      {/* 6. What Changes vs What Stays Fixed During Inference */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted">
          Memory State Lifecycle: Inference-Time Dynamics
        </h3>
        <div className="overflow-x-auto max-w-full rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted border-b border-border font-mono">
              <tr>
                <th className="py-2.5 px-4 font-medium">Memory Component</th>
                <th className="py-2.5 px-4 font-medium">During Inference</th>
                <th className="py-2.5 px-4 font-medium">Architectural Role</th>
                <th className="py-2.5 px-4 font-medium">Analogy in Our Toy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-surface-2/30 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-foreground">Dynamic Synaptic State</td>
                <td className="py-2.5 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-success/15 text-success font-semibold border border-success/30">
                    CHANGES
                  </span>
                </td>
                <td className="py-2.5 px-4 text-muted">
                  Working memory accumulating in-context history via synaptic plasticity
                </td>
                <td className="py-2.5 px-4 font-mono text-accent">Matrix M_t (updated on each step)</td>
              </tr>
              <tr className="hover:bg-surface-2/30 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-foreground">Learned Network Parameters</td>
                <td className="py-2.5 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-surface-2 text-muted border border-border font-semibold">
                    REMAINS FIXED
                  </span>
                </td>
                <td className="py-2.5 px-4 text-muted">
                  Static synaptic architecture, particle layout, and trained baseline connectivity
                </td>
                <td className="py-2.5 px-4 font-mono text-muted">Static vector dimensionality d</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. BDH-CQ Bridge: Recurrent Inference-Time Adaptation */}
      <div className="bg-surface-2 rounded-lg border border-border p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <h3 className="text-sm font-semibold text-foreground">
              The BDH-CQ Bridge: Recurrent Inference-Time Latent Reasoning
            </h3>
          </div>
          <span className="text-[10px] font-mono text-muted bg-surface px-2 py-0.5 rounded border border-border">
            Engdahl et al., August 2026 (arXiv:2608.09888)
          </span>
        </div>

        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
          The BDH-CQ architecture advances this principle to recurrent reasoning: inference-time inputs continuously update recurrent memory, after which the model addresses a query through iterative computation in high-dimensional latent space without verbalizing intermediate tokens.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 rounded bg-surface border border-border/60">
            <span className="text-accent font-semibold block mb-1">Our Simulator Scope:</span>
            <span className="text-muted">
              Single-step associative memory storage and linear retrieval under key overlap.
            </span>
          </div>
          <div className="p-3 rounded bg-surface border border-border/60">
            <span className="text-success font-semibold block mb-1">BDH-CQ Scope:</span>
            <span className="text-muted">
              Continuous recurrent memory updates coupled with multi-step iterative latent computation.
            </span>
          </div>
        </div>
      </div>

      {/* 8. Explicit Scientific Limitations */}
      <div className="p-4 rounded-lg bg-surface-2 border border-border/80 space-y-2 text-xs text-muted">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <span className="text-warning">⚠️</span>
          <span>Scientific Boundaries &amp; Non-Equivalence</span>
        </div>
        <p className="leading-relaxed font-medium text-foreground/90">
          <strong>Does this simulator become BDH?</strong> It does not. The simulator is an educational associative-memory abstraction. BDH is used as a published architectural case study involving dynamic synaptic memory and Hebbian plasticity.
        </p>
        <p className="leading-relaxed">
          This module uses a simplified associative-memory abstraction to illuminate one memory mechanism relevant to BDH. It is not the official BDH implementation, does not reproduce BDH training or inference, does not imply that sparsity automatically eliminates interference, and does not establish that the toy&apos;s measured behavior predicts full-model behavior.
        </p>
        <p className="leading-relaxed">
          Furthermore, BDH-CQ&apos;s recurrent memory and latent reasoning system is substantially richer than this toy experiment. Our retrieval metric is not a BDH-CQ benchmark, and our toy does not reproduce latent reasoning.
        </p>
      </div>
    </section>
  );
}

export default BDHLens;
