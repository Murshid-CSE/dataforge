/**
 * Experiment runner: ties together generators, memory, metrics, and cross-talk.
 *
 * A single experiment is defined by:
 *   - seed: deterministic PRNG seed
 *   - d: vector dimension
 *   - N: number of associations to store
 *   - rho: key overlap/correlation parameter
 *   - rule: 'hebbian' | 'delta'
 *   - beta: delta learning rate (default 1.0, only used for delta)
 *
 * Identical ExperimentConfig → identical ExperimentResult.
 */

import { mulberry32 } from './random';
import { generateKeys, generateValues, meanPairwiseCosine } from './generators';
import { buildMemory, retrieve, type UpdateRule } from './associativeMemory';
import { aggregateQuality, type AggregateQuality } from './metrics';
import { decomposeCrossTalk, type CrossTalkDecomposition } from './crossTalk';
import { createExactKVStore, exactRetrieveByIndex } from './exactKVReference';

/** Configuration for a single experiment. */
export interface ExperimentConfig {
  seed: number;
  d: number;
  N: number;
  rho: number;
  rule: UpdateRule;
  beta?: number;
  /** Index of the query to use for cross-talk decomposition (default: 0). */
  selectedQueryIndex?: number;
}

/** Per-query detail in the result. */
export interface QueryDetail {
  queryIndex: number;
  groundTruth: number[];
  retrieved: number[];
  exactKVRetrieved: number[];
  cosine: number;
  mse: number;
}

/** Full result of a single experiment. */
export interface ExperimentResult {
  config: ExperimentConfig;
  keys: number[][];
  values: number[][];
  memoryMatrix: number[][];
  aggregate: AggregateQuality;
  queryDetails: QueryDetail[];
  crossTalkDecomposition: CrossTalkDecomposition;
  measuredMeanPairwiseCosine: number;
}

/**
 * Run a single experiment with the given configuration.
 * Deterministic: same config → same result.
 */
export function runExperiment(config: ExperimentConfig): ExperimentResult {
  const { seed, d, N, rho, rule, beta = 1.0, selectedQueryIndex = 0 } = config;

  // Create deterministic PRNG
  const rng = mulberry32(seed);

  // Generate data
  const keys = generateKeys(N, d, rho, rng);
  const values = generateValues(N, d, rng);

  // Build memory
  const M = buildMemory(keys, values, rule, beta);

  // Compute aggregate quality
  const aggregate = aggregateQuality(keys, values, M, retrieve);

  // Build exact KV reference
  const store = createExactKVStore(keys, values);

  // Per-query details
  const queryDetails: QueryDetail[] = [];
  for (let i = 0; i < N; i++) {
    const retrieved = retrieve(M, keys[i]);
    const exactRetrieved = exactRetrieveByIndex(store, i);
    queryDetails.push({
      queryIndex: i,
      groundTruth: values[i],
      retrieved,
      exactKVRetrieved: exactRetrieved,
      cosine: aggregate.perQuery[i].cosine,
      mse: aggregate.perQuery[i].mse,
    });
  }

  // Cross-talk decomposition for selected query
  const safeQueryIndex = Math.min(selectedQueryIndex, N - 1);
  const crossTalkDecomposition = decomposeCrossTalk(
    keys,
    values,
    safeQueryIndex,
    queryDetails[safeQueryIndex].retrieved
  );

  // Measured mean pairwise cosine
  const measuredMeanPairwiseCosine = meanPairwiseCosine(keys);

  return {
    config,
    keys,
    values,
    memoryMatrix: M,
    aggregate,
    queryDetails,
    crossTalkDecomposition,
    measuredMeanPairwiseCosine,
  };
}

/**
 * Run an error-vs-N sweep: for N = 1, 2, ..., maxN,
 * compute the aggregate retrieval quality.
 *
 * Uses the same seed, d, rho, and rule for each N value.
 * This is the data for the ErrorChart component.
 */
export interface SweepPoint {
  N: number;
  meanCosine: number;
  meanMSE: number;
  measuredPairwiseCosine: number;
}

export function runErrorVsNSweep(
  seed: number,
  d: number,
  rho: number,
  rule: UpdateRule,
  maxN: number,
  beta: number = 1.0
): SweepPoint[] {
  const points: SweepPoint[] = [];

  // Generate deterministic maximum-length sequence of keys and values.
  // Each N is an exact prefix of this sequence, ensuring strict causality:
  // adding the (n+1)-th association preserves all previous (k_i, v_i) pairs exactly.
  const rng = mulberry32(seed);
  const maxKeys = generateKeys(maxN, d, rho, rng);
  const maxValues = generateValues(maxN, d, rng);

  for (let n = 1; n <= maxN; n++) {
    const keys = maxKeys.slice(0, n);
    const values = maxValues.slice(0, n);
    const M = buildMemory(keys, values, rule, beta);
    const agg = aggregateQuality(keys, values, M, retrieve);
    const measuredCos = meanPairwiseCosine(keys);

    points.push({
      N: n,
      meanCosine: agg.meanCosine,
      meanMSE: agg.meanMSE,
      measuredPairwiseCosine: measuredCos,
    });
  }

  return points;
}
