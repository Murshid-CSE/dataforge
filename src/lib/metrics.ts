/**
 * Retrieval quality metrics.
 *
 * All functions are pure.
 */

import { cosineSimilarity, mse } from './vector';

/** Per-query retrieval quality. */
export interface QueryQuality {
  queryIndex: number;
  cosine: number;
  mse: number;
}

/** Aggregate retrieval quality across all stored associations. */
export interface AggregateQuality {
  meanCosine: number;
  meanMSE: number;
  perQuery: QueryQuality[];
}

/**
 * Compute retrieval quality for a single query.
 */
export function retrievalQuality(
  groundTruth: number[],
  retrieved: number[]
): { cosine: number; mse: number } {
  return {
    cosine: cosineSimilarity(groundTruth, retrieved),
    mse: mse(groundTruth, retrieved),
  };
}

/**
 * Compute aggregate retrieval quality: query every stored key,
 * compare retrieved value to ground-truth value.
 *
 * @param keys - All stored keys
 * @param values - All ground-truth values
 * @param M - The memory matrix
 * @param retrieveFn - Function to retrieve from memory (usually matVecMul)
 * @returns Aggregate quality metrics
 */
export function aggregateQuality(
  keys: number[][],
  values: number[][],
  M: number[][],
  retrieveFn: (M: number[][], q: number[]) => number[]
): AggregateQuality {
  const perQuery: QueryQuality[] = [];
  let totalCosine = 0;
  let totalMSE = 0;

  for (let i = 0; i < keys.length; i++) {
    const retrieved = retrieveFn(M, keys[i]);
    const q = retrievalQuality(values[i], retrieved);
    perQuery.push({
      queryIndex: i,
      cosine: q.cosine,
      mse: q.mse,
    });
    totalCosine += q.cosine;
    totalMSE += q.mse;
  }

  return {
    meanCosine: perQuery.length > 0 ? totalCosine / perQuery.length : 0,
    meanMSE: perQuery.length > 0 ? totalMSE / perQuery.length : 0,
    perQuery,
  };
}
