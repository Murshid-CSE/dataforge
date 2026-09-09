/**
 * Cross-talk decomposition for a single query.
 *
 * For a Hebbian memory with normalized keys, retrieving query q = k_j gives:
 *
 *   v_hat_j = v_j (k_j^T k_j) + Σ_{i≠j} v_i (k_i^T k_j)
 *
 * Since keys are normalized, k_j^T k_j = 1, so:
 *
 *   v_hat_j = v_j + Σ_{i≠j} v_i (k_i^T k_j)
 *
 * The first term is the "target contribution."
 * The second sum is the "cross-talk" — other stored associations leaking
 * into the retrieval because their keys overlap with the query key.
 *
 * This module decomposes the retrieved vector into these components
 * to make the interference mechanism visible to the learner.
 */

import { dot, scale, add, zeros, subtract } from './vector';

/** A single cross-talk contribution from one other stored association. */
export interface CrossTalkTerm {
  /** Index of the interfering association. */
  sourceIndex: number;
  /** Cosine overlap: k_i^T k_j (since keys are normalized). */
  overlap: number;
  /** The contribution vector: v_i * (k_i^T k_j). */
  contribution: number[];
}

/** Full cross-talk decomposition for one query. */
export interface CrossTalkDecomposition {
  /** Index of the queried association. */
  queryIndex: number;
  /** The target contribution: v_j (since k_j^T k_j = 1 for normalized keys). */
  targetContribution: number[];
  /** Individual cross-talk terms from each other association. */
  crossTalkTerms: CrossTalkTerm[];
  /** Sum of all cross-talk contributions. */
  totalCrossTalk: number[];
  /** The full retrieved vector (target + cross-talk). */
  retrieved: number[];
}

/**
 * Decompose the retrieval of a single query into target + cross-talk.
 *
 * This decomposition is exact for the Hebbian (additive) update rule.
 * For the delta rule, the decomposition is approximate / illustrative,
 * since the delta rule modifies the memory non-additively.
 *
 * @param keys - All stored keys (normalized)
 * @param values - All stored values
 * @param queryIndex - Which stored key to query
 * @param retrieved - The actual retrieved vector from the memory
 * @returns Cross-talk decomposition
 */
export function decomposeCrossTalk(
  keys: number[][],
  values: number[][],
  queryIndex: number,
  retrieved: number[]
): CrossTalkDecomposition {
  const d = values[0].length;
  const queryKey = keys[queryIndex];
  const targetValue = values[queryIndex];

  // Target contribution: v_j * (k_j^T k_j) = v_j for normalized keys
  const selfOverlap = dot(queryKey, queryKey); // Should be ≈ 1.0
  const targetContribution = scale(targetValue, selfOverlap);

  // Cross-talk terms
  const crossTalkTerms: CrossTalkTerm[] = [];
  let totalCrossTalk = zeros(d);

  for (let i = 0; i < keys.length; i++) {
    if (i === queryIndex) continue;

    const overlap = dot(keys[i], queryKey);
    const contribution = scale(values[i], overlap);

    crossTalkTerms.push({
      sourceIndex: i,
      overlap,
      contribution,
    });

    totalCrossTalk = add(totalCrossTalk, contribution);
  }

  // For Hebbian, retrieved ≈ targetContribution + totalCrossTalk
  // We use the actual retrieved vector (passed in) for correctness
  // with the delta rule, where the decomposition doesn't sum exactly.

  return {
    queryIndex,
    targetContribution,
    crossTalkTerms,
    totalCrossTalk,
    retrieved,
  };
}

/**
 * Compute the magnitude of the total cross-talk relative to the target.
 * Useful as a single-number summary of interference severity.
 *
 * Returns the ratio of cross-talk norm to target contribution norm.
 */
export function crossTalkRatio(decomposition: CrossTalkDecomposition): number {
  const { targetContribution, totalCrossTalk } = decomposition;
  let targetNorm = 0;
  let crossNorm = 0;
  for (let i = 0; i < targetContribution.length; i++) {
    targetNorm += targetContribution[i] * targetContribution[i];
    crossNorm += totalCrossTalk[i] * totalCrossTalk[i];
  }
  targetNorm = Math.sqrt(targetNorm);
  crossNorm = Math.sqrt(crossNorm);
  return targetNorm > 0 ? crossNorm / targetNorm : 0;
}
