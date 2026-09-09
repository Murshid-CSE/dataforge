import React from 'react';

export function BDHPlaceholder() {
  const steps = [
    'Associative memory',
    'Fast-weight intuition',
    'BDH: synaptic working memory',
    'BDH-CQ: recurrent inference-time memory',
  ];

  return (
    <section
      className="bg-surface rounded-lg border border-border p-6 flex flex-col gap-5"
      aria-labelledby="bdh-placeholder-title"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            The BDH Lens
          </span>
          <h2
            id="bdh-placeholder-title"
            className="text-xl font-semibold text-foreground mt-1 tracking-tight"
          >
            Next: From Fast Weights to Synapses
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-warning/30 bg-warning/10 text-warning text-xs font-medium self-start">
          <span aria-hidden="true">⚠️</span>
          <span>Coming soon — verified against primary sources</span>
        </div>
      </div>

      <div className="bg-surface-2 border-l-4 border-accent p-4 rounded-r text-sm text-foreground/90 leading-relaxed">
        This experiment studies associative memory using a simplified matrix state. The next section will connect this mechanism to the dynamic synaptic state described in Dragon Hatchling (BDH).
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted">
          Conceptual Progression
        </h3>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {steps.map((step, idx) => (
            <React.Fragment key={step}>
              <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-surface-2 border border-border text-xs font-mono text-foreground">
                {step}
              </span>
              {idx < steps.length - 1 && (
                <span className="text-muted text-sm select-none" aria-hidden="true">
                  →
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BDHPlaceholder;
