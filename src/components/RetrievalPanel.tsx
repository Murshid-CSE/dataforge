'use client';

import React from 'react';

export interface RetrievalPanelProps {
  queryIndex: number;
  groundTruth: number[];
  retrieved: number[];
  cosine: number;
  mse: number;
  meanCosine: number;
  meanMSE: number;
  N: number;
  measuredPairwiseCosine: number;
  onQueryChange: (index: number) => void;
}

/**
 * Format vector component value with 3 decimal places and sign alignment.
 */
function formatComponent(val: number): string {
  if (!Number.isFinite(val)) return ' 0.000';
  if (Math.abs(val) < 1e-5) return ' 0.000';
  return val >= 0 ? `+${val.toFixed(3)}` : val.toFixed(3);
}

export function RetrievalPanel({
  queryIndex,
  groundTruth,
  retrieved,
  cosine,
  mse,
  meanCosine,
  meanMSE,
  N,
  measuredPairwiseCosine,
  onQueryChange,
}: RetrievalPanelProps) {
  // Vector dimension
  const length = Math.max(groundTruth.length, retrieved.length);

  // Compute element-wise difference: retrieved - groundTruth
  const errorVector = Array.from({ length }, (_, i) => {
    const r = retrieved[i] ?? 0;
    const g = groundTruth[i] ?? 0;
    return r - g;
  });

  // Color coding for cosine similarity (>0.95 green, >0.8 yellow, else red)
  const cosineColorClass =
    cosine > 0.95
      ? 'text-success'
      : cosine > 0.8
      ? 'text-warning'
      : 'text-cross-talk';

  return (
    <div className="bg-surface rounded-lg border border-border p-4 flex flex-col gap-5">
      {/* Header & Query Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <label
            htmlFor="query-association-select"
            className="text-sm font-medium text-foreground whitespace-nowrap"
          >
            Query association:
          </label>
          <select
            id="query-association-select"
            value={queryIndex}
            onChange={(e) => onQueryChange(Number(e.target.value))}
            className="bg-surface-2 text-foreground border border-border rounded px-2.5 py-1 text-sm font-mono focus:outline-none focus:border-accent"
            aria-label="Select query association"
          >
            {Array.from({ length: Math.max(1, N) }, (_, i) => (
              <option key={i} value={i}>
                Association #{i}
              </option>
            ))}
          </select>
        </div>

        {/* Association counter label */}
        <p className="text-xs text-muted font-mono">
          Displaying query {queryIndex} of {N} stored associations
        </p>
      </div>

      {/* Per-Query Metrics Row */}
      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Current Query Metrics (Association #{queryIndex})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-surface-2 rounded border border-border p-3 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">
              Cosine Similarity
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`font-mono text-xl font-semibold ${cosineColorClass}`}
              >
                {cosine.toFixed(4)}
              </span>
              <span className="text-[11px] text-muted font-mono">
                {cosine > 0.95
                  ? '(Accurate)'
                  : cosine > 0.8
                  ? '(Moderate Cross-talk)'
                  : '(High Degradation)'}
              </span>
            </div>
          </div>

          <div className="bg-surface-2 rounded border border-border p-3 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">
              Normalized Error (MSE)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-xl font-semibold text-foreground">
                {mse.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Three Vectors Side-by-Side in a Grid */}
      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Vector Representations (d = {length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Ground Truth */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between px-1">
              <span className="text-ground-truth font-semibold text-xs tracking-wider uppercase">
                GROUND TRUTH
              </span>
              <span className="text-[11px] text-muted">Expected (v)</span>
            </div>
            <div
              className="bg-surface-2 rounded border border-border p-2 max-h-60 overflow-y-auto divide-y divide-border/20 font-mono text-sm"
              role="list"
              aria-label="Ground truth vector elements"
            >
              {Array.from({ length }, (_, i) => (
                <div
                  key={`gt-${i}`}
                  className="flex items-center justify-between py-1 px-1.5 hover:bg-surface/50"
                >
                  <span className="text-muted text-xs select-none">
                    [{i}]
                  </span>
                  <span className="text-ground-truth">
                    {formatComponent(groundTruth[i] ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Retrieval */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between px-1">
              <span className="text-retrieved font-semibold text-xs tracking-wider uppercase">
                MODEL RETRIEVAL
              </span>
              <span className="text-[11px] text-muted">Memory (v̂ = Mq)</span>
            </div>
            <div
              className="bg-surface-2 rounded border border-border p-2 max-h-60 overflow-y-auto divide-y divide-border/20 font-mono text-sm"
              role="list"
              aria-label="Model retrieved vector elements"
            >
              {Array.from({ length }, (_, i) => (
                <div
                  key={`ret-${i}`}
                  className="flex items-center justify-between py-1 px-1.5 hover:bg-surface/50"
                >
                  <span className="text-muted text-xs select-none">
                    [{i}]
                  </span>
                  <span className="text-retrieved">
                    {formatComponent(retrieved[i] ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Vector */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between px-1">
              <span className="text-cross-talk font-semibold text-xs tracking-wider uppercase">
                ERROR
              </span>
              <span className="text-[11px] text-muted">Difference (v̂ - v)</span>
            </div>
            <div
              className="bg-surface-2 rounded border border-border p-2 max-h-60 overflow-y-auto divide-y divide-border/20 font-mono text-sm"
              role="list"
              aria-label="Error vector elements"
            >
              {Array.from({ length }, (_, i) => (
                <div
                  key={`err-${i}`}
                  className="flex items-center justify-between py-1 px-1.5 hover:bg-surface/50"
                >
                  <span className="text-muted text-xs select-none">
                    [{i}]
                  </span>
                  <span className="text-cross-talk">
                    {formatComponent(errorVector[i] ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Metrics Row */}
      <div className="border-t border-border pt-3">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Aggregate Metrics (All N = {N} Associations)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface-2 rounded border border-border p-3 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">Mean Cosine Similarity</span>
            <span className="font-mono text-lg font-semibold text-foreground mt-1">
              {meanCosine.toFixed(4)}
            </span>
          </div>

          <div className="bg-surface-2 rounded border border-border p-3 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">Retrieval Error (Mean MSE)</span>
            <span className="font-mono text-lg font-semibold text-cross-talk mt-1">
              {meanMSE.toFixed(4)}
            </span>
          </div>

          <div className="bg-surface-2 rounded border border-border p-3 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">
              Measured Mean Key Overlap
            </span>
            <span className="font-mono text-lg font-semibold text-accent mt-1">
              {measuredPairwiseCosine.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetrievalPanel;
