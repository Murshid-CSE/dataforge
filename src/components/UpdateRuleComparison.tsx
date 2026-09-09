'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import type { ExperimentResult } from '@/lib/experiments';

export interface UpdateRuleComparisonProps {
  primaryResult: ExperimentResult;
  comparisonResult: ExperimentResult;
  queryIndex: number;
}

function getCosineColor(cos: number): string {
  if (cos >= 0.85) return 'text-success';
  if (cos >= 0.6) return 'text-accent';
  if (cos >= 0.35) return 'text-warning';
  return 'text-cross-talk';
}

function getQueryCosine(res: ExperimentResult | null | undefined, qIdx: number): string {
  if (!res || !res.queryDetails || res.queryDetails.length === 0) return '—';
  const detail = res.queryDetails.find((q) => q.queryIndex === qIdx) ?? res.queryDetails[qIdx];
  return detail !== undefined ? detail.cosine.toFixed(3) : '—';
}

function getQueryMSE(res: ExperimentResult | null | undefined, qIdx: number): string {
  if (!res || !res.queryDetails || res.queryDetails.length === 0) return '—';
  const detail = res.queryDetails.find((q) => q.queryIndex === qIdx) ?? res.queryDetails[qIdx];
  return detail !== undefined ? detail.mse.toFixed(4) : '—';
}

interface RuleCardProps {
  name: string;
  equation: string;
  result: ExperimentResult;
  queryIndex: number;
}

function RuleCard({ name, equation, result, queryIndex }: RuleCardProps) {
  const meanCosine = result?.aggregate?.meanCosine ?? 0;
  const meanMSE = result?.aggregate?.meanMSE ?? 0;
  const queryCosine = getQueryCosine(result, queryIndex);
  const queryMSE = getQueryMSE(result, queryIndex);

  return (
    <div className="bg-surface-2 rounded-lg border border-border p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-foreground">{`${name} Rule`}</h4>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface border border-border text-muted">
            {result?.config?.rule ?? name.toLowerCase()}
          </span>
        </div>

        <div className="bg-surface/80 rounded px-2.5 py-2 border border-border/60 mb-4 overflow-x-auto text-center">
          <InlineMath math={equation} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface/60 p-2.5 rounded border border-border/50">
            <span className="text-[10px] text-muted block uppercase tracking-wider mb-0.5">
              Retrieval Error (MSE)
            </span>
            <div className="text-xl font-bold font-mono text-cross-talk">
              {meanMSE.toFixed(4)}
            </div>
          </div>

          <div className="bg-surface/60 p-2.5 rounded border border-border/50">
            <span className="text-[10px] text-muted block uppercase tracking-wider mb-0.5">
              Mean Cosine
            </span>
            <div className={`text-xl font-bold font-mono ${getCosineColor(meanCosine)}`}>
              {meanCosine.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 pt-3 border-t border-border/60 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted">Query #{queryIndex} Retrieval Error:</span>
          <span className="font-mono text-foreground font-medium">{queryMSE}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Query #{queryIndex} Cosine:</span>
          <span className="font-mono text-foreground font-medium">{queryCosine}</span>
        </div>
      </div>
    </div>
  );
}

export function UpdateRuleComparison({
  primaryResult,
  comparisonResult,
  queryIndex,
}: UpdateRuleComparisonProps) {
  const results = [primaryResult, comparisonResult].filter(Boolean);
  const hebbianResult =
    results.find((r) => r.config.rule === 'hebbian') ??
    (primaryResult?.config?.rule === 'hebbian' ? primaryResult : comparisonResult);

  const deltaResult =
    results.find((r) => r.config.rule === 'delta') ??
    (primaryResult?.config?.rule === 'delta' ? primaryResult : comparisonResult);

  return (
    <div className="bg-surface rounded-lg border border-border p-4 sm:p-5">
      {/* 1 & 2. Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">Update Rule Comparison</h3>
          <p className="text-xs text-muted mt-0.5">
            Evaluating how the memory-update rule alters what information survives in a bounded associative state
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-accent/15 border border-accent/30 text-accent text-xs font-mono font-medium self-start sm:self-auto">
          Same data; different update rule.
        </span>
      </div>

      {/* 3. Two columns side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
        <RuleCard
          name="Hebbian"
          equation="M_t = M_{t-1} + v_t k_t^\top"
          result={hebbianResult}
          queryIndex={queryIndex}
        />
        <RuleCard
          name="Delta"
          equation="M_t = M_{t-1} + \beta (v_t - M_{t-1} k_t) k_t^\top"
          result={deltaResult}
          queryIndex={queryIndex}
        />
      </div>

      {/* 4. Bottom note */}
      <p className="text-xs text-muted mt-4 pt-3 border-t border-border/60 leading-relaxed">
        <strong>Scientific insight:</strong> The memory-update rule changes what information survives in the bounded state. The Delta rule corrects toward the desired value based on current error, but does not eliminate interference entirely. Both rules process the stream with fixed-size state <InlineMath math="M \in \mathbb{R}^{d \times d}" />.
      </p>
    </div>
  );
}

export default UpdateRuleComparison;
