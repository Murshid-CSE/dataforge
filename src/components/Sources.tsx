import React from 'react';

interface PrimarySource {
  id: number;
  title: string;
  authors: string;
  year: number;
  arxivId: string;
  url: string;
  usedFor: string;
  keyFinding: string;
}

const PRIMARY_SOURCES: PrimarySource[] = [
  {
    id: 1,
    title: 'The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain',
    authors: 'Adrian Kosowski, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, Michał Bartoszkiewicz',
    year: 2025,
    arxivId: 'arXiv:2509.26507',
    url: 'https://arxiv.org/abs/2509.26507',
    usedFor: 'Inference-time working memory via synaptic plasticity and Hebbian learning',
    keyFinding: 'Demonstrates working memory formed by strengthening concept-specific synapses with sparse positive activations in a scale-free particle graph.',
  },
  {
    id: 2,
    title: 'BDH-CQ: Recurrent Inference-Time Latent Reasoning',
    authors: 'Engdahl et al.',
    year: 2026,
    arxivId: 'arXiv:2608.09888',
    url: 'https://arxiv.org/abs/2608.09888',
    usedFor: 'Recurrent memory adaptation and multi-step latent computation',
    keyFinding: 'Continuous inference-time recurrent updates followed by iterative problem-solving in high-dimensional latent space.',
  },
  {
    id: 3,
    title: 'Retentive Network: A Successor to Transformer for Large Language Models',
    authors: 'Sun et al.',
    year: 2023,
    arxivId: 'arXiv:2307.08621',
    url: 'https://arxiv.org/abs/2307.08621',
    usedFor: 'Dual representation connecting recurrence and attention with bounded inference state',
    keyFinding: 'Demonstrates equivalence between parallel training and O(1) inference-cost recurrent state updates.',
  },
  {
    id: 4,
    title: 'Gated Linear Attention Transformers with Hardware-Efficient Training',
    authors: 'Yang et al.',
    year: 2023,
    arxivId: 'arXiv:2312.06635',
    url: 'https://arxiv.org/abs/2312.06635',
    usedFor: 'Matrix-valued recurrent state and data-dependent decay gating',
    keyFinding: 'Incorporates element-wise data-dependent gates to dynamically control memory retention across sequence steps.',
  },
  {
    id: 5,
    title: 'Parallelizing Linear Transformers with the Delta Rule over Sequence Length',
    authors: 'Yang et al.',
    year: 2024,
    arxivId: 'arXiv:2406.06484',
    url: 'https://arxiv.org/abs/2406.06484',
    usedFor: 'Delta-rule associative-memory update and hardware-efficient training of DeltaNet',
    keyFinding: 'Replaces naive additive memory updates with an error-correcting delta rule to directly target recall error and mitigate interference.',
  },
  {
    id: 6,
    title: 'Gated Delta Networks: Improving Mamba2 with Delta Rule',
    authors: 'Yang, Kautz, Hatamizadeh',
    year: 2024,
    arxivId: 'arXiv:2412.06464',
    url: 'https://arxiv.org/abs/2412.06464',
    usedFor: 'Gated delta memory updates, adaptive memory control, and improved associative retrieval',
    keyFinding: 'Unifies data-dependent gating with delta updates to dynamically regulate retention and selective forgetting in recurrent states.',
  },
];

export function Sources() {
  return (
    <section
      className="bg-surface rounded-lg border border-border p-5 sm:p-6 flex flex-col gap-5"
      aria-labelledby="sources-title"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
          Scientific Provenance & Literature
        </span>
        <h2
          id="sources-title"
          className="text-xl font-semibold text-foreground tracking-tight"
        >
          Primary Sources & Research Foundation
        </h2>
        <p className="text-xs text-muted">
          Peer-reviewed and arXiv primary literature anchoring the mathematical and conceptual formulation of Memory Under Pressure
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface-2/40 overflow-hidden">
        {PRIMARY_SOURCES.map((source) => (
          <div
            key={source.id}
            className="flex flex-col sm:flex-row sm:items-baseline gap-3 p-4 text-xs hover:bg-surface-2/70 transition-colors"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded bg-surface border border-border font-mono font-bold text-accent shrink-0">
              {source.id}
            </span>
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-foreground hover:text-accent transition-colors text-sm flex items-center gap-1"
                >
                  <span>{source.title}</span>
                  <span className="text-muted text-xs font-normal" aria-hidden="true">↗</span>
                </a>
                <span className="font-mono text-muted text-[11px] bg-surface px-2 py-0.5 rounded border border-border">
                  {source.authors} ({source.year}) &bull; {source.arxivId}
                </span>
              </div>

              <div className="text-muted">
                <span className="text-foreground/90 font-medium">Relevance to project:</span>{' '}
                {source.usedFor}
              </div>

              <div className="text-muted/80 italic text-[11px]">
                &ldquo;{source.keyFinding}&rdquo;
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded bg-surface-2/60 border border-border text-xs text-muted leading-relaxed space-y-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-semibold text-foreground/90">
            Literature Provenance &amp; Distinct Roles:
          </span>
          <span className="font-mono text-[11px] text-accent font-medium">
            Status: Verified Primary Research
          </span>
        </div>
        <p>
          Each reference addresses a distinct research role: RetNet (recurrent constant-size sequence modeling), GLA (matrix-valued recurrent attention and gating), DeltaNet (delta-rule associative updates and hardware-efficient training), Gated DeltaNet (gated delta updates and adaptive memory control), BDH (synaptic plasticity and inference-time working memory), and BDH-CQ (recurrent inference-time memory and latent reasoning). These papers provide independent architectural context; they are not presented as proofs of this toy model&apos;s specific synthetic behavior.
        </p>
      </div>
    </section>
  );
}

export default Sources;
