/**
 * Associative memory implementations.
 *
 * Two update rules:
 * 1. Hebbian (additive): M_t = M_{t-1} + v_t k_t^T
 * 2. Delta:              M_t = M_{t-1} + β (v_t - M_{t-1} k_t) k_t^T
 *
 * Keys are assumed to be L2-normalized.
 * η = 1 for the Hebbian rule (not a user control).
 * β = 1 for the Delta rule (fixed, not a user control).
 *
 * All functions are pure — they return new matrices.
 */

import { outerProduct, addMatrix, matVecMul, subtract, zeroMatrix } from './vector';

/** Supported update rule types. */
export type UpdateRule = 'hebbian' | 'delta';

/**
 * Hebbian (additive) write: M_new = M + v k^T
 *
 * @param M - Current memory matrix (d_v × d_k)
 * @param v - Value vector to store
 * @param k - Key vector (should be normalized)
 * @returns New memory matrix after the write
 */
export function hebbianWrite(M: number[][], v: number[], k: number[]): number[][] {
  const vkT = outerProduct(v, k);
  return addMatrix(M, vkT);
}

/**
 * Delta-rule write: M_new = M + β (v - M k) k^T
 *
 * The delta rule updates memory according to the retrieval error for the
 * current key. Instead of blindly adding, it corrects toward the desired value.
 *
 * @param M - Current memory matrix (d_v × d_k)
 * @param v - Desired value vector
 * @param k - Key vector (should be normalized)
 * @param beta - Learning rate for the delta correction (default 1.0)
 * @returns New memory matrix after the delta update
 */
export function deltaWrite(
  M: number[][],
  v: number[],
  k: number[],
  beta: number = 1.0
): number[][] {
  // Current retrieval for this key
  const currentRetrieval = matVecMul(M, k);
  // Error: what we want minus what we get
  const error = subtract(v, currentRetrieval);
  // Scale error by beta
  const scaledError = error.map(e => e * beta);
  // Outer product of scaled error with key
  const correction = outerProduct(scaledError, k);
  return addMatrix(M, correction);
}

/**
 * Retrieve a value from memory given a query vector.
 * v_hat = M q
 *
 * @param M - Memory matrix (d_v × d_k)
 * @param q - Query vector
 * @returns Retrieved value vector
 */
export function retrieve(M: number[][], q: number[]): number[] {
  return matVecMul(M, q);
}

/**
 * Build a complete memory state by sequentially writing all key/value pairs.
 *
 * @param keys - Array of key vectors
 * @param values - Array of value vectors (same length as keys)
 * @param rule - Update rule to use
 * @param beta - Learning rate for delta rule (ignored for hebbian)
 * @returns The final memory matrix after all writes
 */
export function buildMemory(
  keys: number[][],
  values: number[][],
  rule: UpdateRule,
  beta: number = 1.0
): number[][] {
  const dv = values[0].length;
  const dk = keys[0].length;
  let M = zeroMatrix(dv, dk);

  for (let i = 0; i < keys.length; i++) {
    if (rule === 'hebbian') {
      M = hebbianWrite(M, values[i], keys[i]);
    } else {
      M = deltaWrite(M, values[i], keys[i], beta);
    }
  }

  return M;
}
