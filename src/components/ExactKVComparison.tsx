'use client';

import React from 'react';

export interface ExactKVComparisonProps {
  queryIndex: number;
  groundTruth: number[];
  associativeRetrieved: number[];
  exactKVRetrieved: number[];
  associativeCosine: number;
  exactKVCosine: number;
  associativeMSE: number;
  exactKVMSE: number;
  N: number;
  d: number;
}

/**
 * Format vector component value with 3 decimal places and sign alignment.
 */
function formatComponent(val: number): string {
  if (!Number.isFinite(val)) return ' 0.000';
  if (Math.abs(val) < 1e-5) return ' 0.000';
  return val >= 0 ? `+${val.toFixed(3)}` : val.toFixed(3);
}

export function ExactKVComparison({
  queryIndex,
  groundTruth,
  associativeRetrieved,
  exactKVRetrieved,
  associativeCosine,
  exactKVCosine,
  associativeMSE,
  exactKVMSE,
  N,
  d,
}: ExactKVComparisonProps) {
  const length = Math.max(
    d,
    groundTruth.length,
    associativeRetrieved.length,
    exactKVRetrieved.length
  );

  // Color coding for associative cosine similarity
  const assocCosineColor =
    associativeCosine > 0.95
      ? 'text-success'
      : associativeCosine > 0.8
      ? 'text-warning'
      : 'text-cross-talk';

  return (
    <div className="bg-surface rounded-lg border border-border p-4 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Fixed Associative State vs Exact KV Reference
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Comparing retrieval fidelity for Query #{queryIndex}
          </p>
        </div>
        <span className="text-xs font-mono text-muted bg-surface-2 px-2.5 py-1 rounded border border-border">
          N = {N} associations &bull; d = {d} dimensions
        </span>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Fixed Associative State */}
        <div className="bg-surface-2/50 rounded-lg border border-border p-3.5 flex flex-col gap-3">
          <div>
            <h4 className="text-sm font-semibold text-retrieved">
              Fixed Associative State
            </h4>
            <p className="text-xs text-muted mt-0.5">
              Compresses N={N} associations into a {d}&times;{d} matrix
            </p>
          </div>

          {/* Associative Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface rounded border border-border p-2">
              <span className="text-[11px] text-muted block">
                Cosine Similarity
              </span>
              <span
                className={`font-mono text-base font-semibold ${assocCosineColor}`}
              >
                {associativeCosine.toFixed(4)}
              </span>
            </div>
            <div className="bg-surface rounded border border-border p-2">
              <span className="text-[11px] text-muted block">
                Normalized Error (MSE)
              </span>
              <span className="font-mono text-base font-semibold text-foreground">
                {associativeMSE.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Retrieved Vector Display */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted px-1 mb-1 font-mono">
              <span>Retrieved vector (v̂)</span>
              <span>d = {length}</span>
            </div>
            <div
              className="bg-surface-2 rounded border border-border p-2 max-h-56 overflow-y-auto divide-y divide-border/20 font-mono text-sm"
              role="list"
              aria-label="Fixed associative retrieved vector"
            >
              {Array.from({ length }, (_, i) => (
                <div
                  key={`assoc-${i}`}
                  className="flex items-center justify-between py-1 px-1.5 hover:bg-surface/50"
                >
                  <span className="text-muted text-xs select-none">[{i}]</span>
                  <span className="text-retrieved">
                    {formatComponent(associativeRetrieved[i] ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Exact KV Reference */}
        <div className="bg-surface-2/50 rounded-lg border border-border p-3.5 flex flex-col gap-3">
          <div>
            <h4 className="text-sm font-semibold text-exact-kv">
              Exact KV Reference
            </h4>
            <p className="text-xs text-muted mt-0.5">
              Retains each key/value pair explicitly
            </p>
          </div>

          {/* Exact KV Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface rounded border border-border p-2">
              <span className="text-[11px] text-muted block">
                Cosine Similarity
              </span>
              <span className="font-mono text-base font-semibold text-success">
                {exactKVCosine.toFixed(4)}
              </span>
            </div>
            <div className="bg-surface rounded border border-border p-2">
              <span className="text-[11px] text-muted block">
                Normalized Error (MSE)
              </span>
              <span className="font-mono text-base font-semibold text-success">
                {exactKVMSE.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Exact KV Retrieved Vector Display */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted px-1 mb-1 font-mono">
              <span>Retrieved vector (exact)</span>
              <span>d = {length}</span>
            </div>
            <div
              className="bg-surface-2 rounded border border-border p-2 max-h-56 overflow-y-auto divide-y divide-border/20 font-mono text-sm"
              role="list"
              aria-label="Exact KV reference retrieved vector"
            >
              {Array.from({ length }, (_, i) => (
                <div
                  key={`exact-${i}`}
                  className="flex items-center justify-between py-1 px-1.5 hover:bg-surface/50"
                >
                  <span className="text-muted text-xs select-none">[{i}]</span>
                  <span className="text-exact-kv">
                    {formatComponent(exactKVRetrieved[i] ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pedagogical Note */}
      <div className="rounded bg-surface-2/60 border border-border p-3 text-xs text-muted leading-relaxed">
        <strong>Pedagogical exact-memory reference:</strong> The Exact KV Reference retains each key/value pair explicitly in an uncompressed memory buffer. The Fixed Associative State compresses all associations into one bounded \(d \times d\) matrix. This serves as an idealized pedagogical comparison baseline, not a complete Transformer attention model or a production KV cache.
      </div>
    </div>
  );
}

export default ExactKVComparison;
