import React from 'react';

const BOUNDARIES = [
  'This experiment does not claim N ≤ d guarantees perfect retrieval',
  'This experiment does not claim fixed-state memory universally forgets',
  'Sparsity does not automatically eliminate interference',
  'The Delta rule reduces but does not eliminate interference',
  'Results depend on key geometry and experimental parameters',
];

export function Limitations() {
  return (
    <section
      className="bg-surface rounded-lg border border-border p-6 flex flex-col gap-6"
      aria-labelledby="limitations-title"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono uppercase tracking-wider text-accent">
          Scientific Transparency
        </span>
        <h2
          id="limitations-title"
          className="text-xl font-semibold text-foreground tracking-tight"
        >
          Limitations & Honest Labels
        </h2>
      </div>

      {/* 1. Educational Toy Model */}
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-surface-2 border border-border">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-accent/15 text-accent border border-accent/30">
            EDUCATIONAL TOY MODEL
          </span>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">
          This simulator isolates associative-memory behavior using a simplified outer-product memory. It is not an implementation of a production language model, BDH, or any published architecture.
        </p>
      </div>

      {/* 2. Scientific Boundaries */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted">
          SCIENTIFIC BOUNDARIES
        </h3>
        <ul className="space-y-2.5">
          {BOUNDARIES.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-foreground/90 leading-relaxed"
            >
              <span className="text-accent select-none mt-0.5" aria-hidden="true">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Provenance */}
      <div className="flex flex-col gap-2 p-4 rounded-lg bg-surface-2 border border-border">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted">
          PROVENANCE
        </h3>
        <p className="text-sm text-foreground/90 leading-relaxed">
          All numerical results shown in the interface are computed live in the browser from the stated equations. No results are hard-coded or pre-fabricated.
        </p>
      </div>
    </section>
  );
}

export default Limitations;
