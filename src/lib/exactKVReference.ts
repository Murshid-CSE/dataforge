/**
 * Exact KV Reference — an uncompressed memory baseline.
 *
 * Stores all (key, value) pairs explicitly.
 * For a query, finds the stored key with the highest cosine similarity
 * and returns its associated value.
 *
 * Purpose: provide a ground-truth reference against which the bounded
 * associative memory can be measured. This is NOT a Transformer or
 * attention implementation — it is simply an explicit key-value store.
 */

import { cosineSimilarity } from './vector';

export interface ExactKVStore {
  keys: number[][];
  values: number[][];
}

/**
 * Create an exact KV store from parallel key/value arrays.
 */
export function createExactKVStore(keys: number[][], values: number[][]): ExactKVStore {
  return { keys: keys.slice(), values: values.slice() };
}

/**
 * Retrieve the value associated with the most similar stored key.
 *
 * Uses cosine similarity to find the best-matching stored key.
 * If the query exactly matches a stored key, returns its exact value.
 *
 * @param store - The exact KV store
 * @param query - The query vector
 * @returns The value associated with the closest stored key
 */
export function exactRetrieve(store: ExactKVStore, query: number[]): number[] {
  if (store.keys.length === 0) {
    throw new Error('Cannot retrieve from an empty store');
  }

  let bestIdx = 0;
  let bestSim = -Infinity;

  for (let i = 0; i < store.keys.length; i++) {
    const sim = cosineSimilarity(store.keys[i], query);
    if (sim > bestSim) {
      bestSim = sim;
      bestIdx = i;
    }
  }

  // Return a copy to maintain purity
  return store.values[bestIdx].slice();
}

/**
 * Retrieve the value for a specific stored key by index.
 * This is useful when you know which key you stored and want the exact
 * ground-truth value.
 *
 * @param store - The exact KV store
 * @param index - Index of the stored key/value pair
 * @returns A copy of the stored value
 */
export function exactRetrieveByIndex(store: ExactKVStore, index: number): number[] {
  if (index < 0 || index >= store.values.length) {
    throw new Error(`Index ${index} out of bounds [0, ${store.values.length})`);
  }
  return store.values[index].slice();
}
