'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import type { CrossTalkDecomposition } from '@/lib/crossTalk';
import { norm } from '@/lib/vector';

export interface CrossTalkExplainerProps {
  decomposition: CrossTalkDecomposition;
  queryIndex: number;
  d: number;
  rule: string;
}

function formatVectorSlice(vec: number[] | undefined, maxElements = 4): string {
  if (!vec || vec.length === 0) return '[]';
  const slice = vec.slice(0, maxElements);
  const formatted = slice.map((v) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))).join(', ');
  return `[${formatted}${vec.length > maxElements ? ', …' : ''}]`;
}

export function CrossTalkExplainer({
  decomposition,
  queryIndex,
  d,
  rule,
}: CrossTalkExplainerProps) {
  const isHebbian = rule.toLowerCase() === 'hebbian';

  const topContributors = React.useMemo(() => {
    if (!decomposition?.crossTalkTerms) return [];
    return [...decomposition.crossTalkTerms]
      .sort((a, b) => Math.abs(b.overlap) - Math.abs(a.overlap))
      .slice(0, 5);
  }, [decomposition?.crossTalkTerms]);

  const targetSlice = formatVectorSlice(decomposition?.targetContribution);
  const crossTalkSlice = formatVectorSlice(decomposition?.totalCrossTalk);
  const retrievedSlice = formatVectorSlice(decomposition?.retrieved);

  return (
    <div className="bg-surface rounded-lg border border-border p-4 sm:p-5">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">
              Why Does Retrieval Differ from Ground Truth?
            </h3>
            {isHebbian ? (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-success/15 border border-success/30 text-success font-semibold">
                Exact Hebbian decomposition
              </span>
            ) : (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-warning/15 border border-warning/30 text-warning font-semibold">
                Delta mode (Non-linear update)
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {isHebbian
              ? `Mathematical cross-talk breakdown for query association #${queryIndex}`
              : `Retrieval behavior under error-correcting Delta update for query association #${queryIndex}`}
          </p>
        </div>
      </div>

      {isHebbian ? (
        <>
          {/* 2. KaTeX Mathematical Equation for Hebbian */}
          <div className="bg-surface-2 rounded-lg border border-border p-3 my-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 overflow-x-auto text-center">
              <div className="[&>.katex-display]:my-1">
                <BlockMath math={"\\hat{v}_j = v_j + \\sum_{i \\neq j} v_i (k_i^\\top k_j)"} />
              </div>
              <span className="text-xs text-cross-talk font-medium whitespace-nowrap self-center pb-0.5">
                ← cross-talk / interference term
              </span>
            </div>
          </div>

          {/* 3. Three-Block Visual Decomposition (Target + Cross-talk = Retrieved) */}
          <div className="my-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 sm:gap-3">
              {/* Block 1: TARGET CONTRIBUTION */}
              <div className="flex-1 bg-surface-2 border border-border rounded-lg p-3 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold tracking-wider text-ground-truth uppercase">
                    TARGET CONTRIBUTION (v_j)
                  </span>
                  <span className="text-[10px] font-mono text-muted">k_j^T k_j = 1.0</span>
                </div>
                <div
                  className="font-mono text-xs text-foreground bg-surface/80 rounded px-2.5 py-2 border border-border/50 truncate"
                  title={targetSlice}
                >
                  {targetSlice}
                </div>
              </div>

              {/* Plus Sign */}
              <div className="flex items-center justify-center text-xl font-bold text-muted select-none px-1">
                +
              </div>

              {/* Block 2: CROSS-TALK */}
              <div className="flex-1 bg-surface-2 border border-border rounded-lg p-3 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold tracking-wider text-cross-talk uppercase">
                    CROSS-TALK (Σ v_i (k_i^T k_j))
                  </span>
                  <span className="text-[10px] font-mono text-cross-talk">
                    norm = {norm(decomposition?.totalCrossTalk || []).toFixed(3)}
                  </span>
                </div>
                <div
                  className="font-mono text-xs text-foreground bg-surface/80 rounded px-2.5 py-2 border border-border/50 truncate"
                  title={crossTalkSlice}
                >
                  {crossTalkSlice}
                </div>
              </div>

              {/* Equals Sign */}
              <div className="flex items-center justify-center text-xl font-bold text-muted select-none px-1">
                =
              </div>

              {/* Block 3: RETRIEVED */}
              <div className="flex-1 bg-surface-2 border border-border rounded-lg p-3 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold tracking-wider text-retrieved uppercase">
                    RETRIEVED VECTOR (v̂_j)
                  </span>
                  <span className="text-[10px] font-mono text-muted">Model estimate</span>
                </div>
                <div
                  className="font-mono text-xs text-foreground bg-surface/80 rounded px-2.5 py-2 border border-border/50 truncate"
                  title={retrievedSlice}
                >
                  {retrievedSlice}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Top Cross-Talk Contributors Table */}
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Top Cross-Talk Contributors (by |overlap|)</span>
              <span className="text-[11px] font-normal text-muted normal-case">
                Higher key overlap (<InlineMath math="|k_i^\top k_j|" />) transfers more value energy
              </span>
            </h4>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-2 text-muted border-b border-border">
                  <tr>
                    <th className="py-2 px-3 font-medium">Interfering Association i</th>
                    <th className="py-2 px-3 font-medium">
                      Key overlap (<InlineMath math="k_i^\top k_j" />)
                    </th>
                    <th className="py-2 px-3 font-medium text-right">
                      Transferred contribution norm
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {topContributors.length > 0 ? (
                    topContributors.map((term) => {
                      const isHighOverlap = Math.abs(term.overlap) > 0.3;
                      const magnitude = norm(term.contribution);

                      return (
                        <tr
                          key={term.sourceIndex}
                          className="hover:bg-surface-2/40 transition-colors"
                        >
                          <td className="py-2 px-3 font-mono text-foreground">
                            {`Association #${term.sourceIndex}`}
                          </td>
                          <td
                            className={`py-2 px-3 font-mono ${
                              isHighOverlap ? 'text-cross-talk font-semibold' : 'text-muted'
                            }`}
                          >
                            {term.overlap >= 0 ? '+' : ''}
                            {term.overlap.toFixed(3)}
                          </td>
                          <td className="py-2 px-3 font-mono text-foreground text-right">
                            {magnitude.toFixed(3)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-3 px-3 text-center text-muted italic"
                      >
                        No interfering associations stored (N = 1).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Delta Mode Presentation — Does NOT misuse Hebbian decomposition */
        <div className="my-3 space-y-4">
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 text-xs text-foreground/90 space-y-2">
            <div className="flex items-center gap-2 text-warning font-semibold text-sm">
              <span>⚠️</span>
              <span>Cross-talk decomposition shown only for Hebbian memory</span>
            </div>
            <p className="leading-relaxed">
              The additive decomposition <InlineMath math="\hat{v}_j = v_j + \sum_{i \neq j} v_i (k_i^\top k_j)" /> does not directly describe the Delta update.
              Instead of unconditionally superimposing outer products, the Delta rule applies error-driven corrections:
            </p>
            <div className="py-1">
              <BlockMath math={"M_t = M_{t-1} + \\beta (v_t - M_{t-1} k_t) k_t^\\top"} />
            </div>
            <p className="leading-relaxed text-muted">
              Because each update subtracts the model&apos;s current prediction <InlineMath math="M_{t-1} k_t" />, memory modification is dynamic and order-dependent. While it targets and reduces recall error, cross-talk remains present in bounded state when key vectors overlap.
            </p>
          </div>

          {/* Delta Retrieval Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-2 border border-border rounded-lg p-3">
              <span className="text-[11px] font-semibold text-ground-truth uppercase block mb-1">
                Target Ground Truth (v_{queryIndex})
              </span>
              <div className="font-mono text-xs text-foreground bg-surface/80 rounded px-2.5 py-2 border border-border/50 truncate">
                {targetSlice}
              </div>
            </div>

            <div className="bg-surface-2 border border-border rounded-lg p-3">
              <span className="text-[11px] font-semibold text-retrieved uppercase block mb-1">
                Delta Retrieved Vector (v̂_{queryIndex})
              </span>
              <div className="font-mono text-xs text-foreground bg-surface/80 rounded px-2.5 py-2 border border-border/50 truncate">
                {retrievedSlice}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrossTalkExplainer;
