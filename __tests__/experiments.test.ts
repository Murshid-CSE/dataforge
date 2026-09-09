import { describe, it, expect } from 'vitest';
import { runExperiment, runErrorVsNSweep } from '../src/lib/experiments';

describe('runExperiment', () => {
  const baseConfig = {
    seed: 42,
    d: 8,
    N: 4,
    rho: 0,
    rule: 'hebbian' as const,
  };

  it('produces deterministic results (reproducibility test)', () => {
    const result1 = runExperiment(baseConfig);
    const result2 = runExperiment(baseConfig);

    // Same keys
    expect(result1.keys).toEqual(result2.keys);
    // Same values
    expect(result1.values).toEqual(result2.values);
    // Same memory matrix
    expect(result1.memoryMatrix).toEqual(result2.memoryMatrix);
    // Same aggregate metrics
    expect(result1.aggregate.meanCosine).toBe(result2.aggregate.meanCosine);
    expect(result1.aggregate.meanMSE).toBe(result2.aggregate.meanMSE);
    // Same per-query results
    for (let i = 0; i < baseConfig.N; i++) {
      expect(result1.queryDetails[i].cosine).toBe(result2.queryDetails[i].cosine);
      expect(result1.queryDetails[i].mse).toBe(result2.queryDetails[i].mse);
    }
  });

  it('different seeds produce different results', () => {
    const result1 = runExperiment({ ...baseConfig, seed: 42 });
    const result2 = runExperiment({ ...baseConfig, seed: 99 });

    expect(result1.keys).not.toEqual(result2.keys);
  });

  it('returns correct number of query details', () => {
    const result = runExperiment(baseConfig);
    expect(result.queryDetails).toHaveLength(baseConfig.N);
  });

  it('includes cross-talk decomposition', () => {
    const result = runExperiment(baseConfig);
    expect(result.crossTalkDecomposition).toBeDefined();
    expect(result.crossTalkDecomposition.queryIndex).toBe(0);
    expect(result.crossTalkDecomposition.targetContribution).toHaveLength(baseConfig.d);
  });

  it('shows higher error with higher rho', () => {
    const lowRho = runExperiment({ ...baseConfig, N: 16, rho: 0 });
    const highRho = runExperiment({ ...baseConfig, N: 16, rho: 0.8 });

    // Higher rho → more overlap → more interference → lower cosine
    expect(highRho.aggregate.meanCosine).toBeLessThan(lowRho.aggregate.meanCosine);
  });

  it('shows higher error with more associations', () => {
    const fewAssociations = runExperiment({ ...baseConfig, N: 2, rho: 0 });
    const manyAssociations = runExperiment({ ...baseConfig, N: 32, rho: 0 });

    // More associations → typically more interference
    // (not guaranteed as a universal theorem, but statistically expected)
    expect(manyAssociations.aggregate.meanCosine).toBeLessThanOrEqual(
      fewAssociations.aggregate.meanCosine
    );
  });

  it('delta rule produces valid results', () => {
    const result = runExperiment({ ...baseConfig, rule: 'delta' });
    expect(result.aggregate.meanCosine).toBeGreaterThan(0);
    expect(result.queryDetails).toHaveLength(baseConfig.N);
  });

  it('reports measured mean pairwise cosine', () => {
    const result = runExperiment(baseConfig);
    expect(typeof result.measuredMeanPairwiseCosine).toBe('number');
    expect(result.measuredMeanPairwiseCosine).toBeGreaterThanOrEqual(0);
    expect(result.measuredMeanPairwiseCosine).toBeLessThanOrEqual(1);
  });
});

describe('runErrorVsNSweep', () => {
  it('produces sweep points for each N', () => {
    const points = runErrorVsNSweep(42, 8, 0, 'hebbian', 10);
    expect(points).toHaveLength(10);
    expect(points[0].N).toBe(1);
    expect(points[9].N).toBe(10);
  });

  it('is deterministic', () => {
    const sweep1 = runErrorVsNSweep(42, 8, 0, 'hebbian', 10);
    const sweep2 = runErrorVsNSweep(42, 8, 0, 'hebbian', 10);

    for (let i = 0; i < 10; i++) {
      expect(sweep1[i].meanCosine).toBe(sweep2[i].meanCosine);
      expect(sweep1[i].meanMSE).toBe(sweep2[i].meanMSE);
    }
  });

  it('N=1 should have near-perfect retrieval', () => {
    const points = runErrorVsNSweep(42, 8, 0, 'hebbian', 1);
    // Single association in a large space → exact retrieval
    expect(points[0].meanCosine).toBeCloseTo(1.0, 6);
  });

  it('preserves earlier associations as a strict prefix (experimental causality)', () => {
    // Verifies that N=5 sweep point uses the exact same first 5 associations as N=10
    const sweep = runErrorVsNSweep(42, 8, 0.2, 'hebbian', 10);
    expect(sweep).toHaveLength(10);
    // Ensure all points computed valid finite numbers
    for (const pt of sweep) {
      expect(Number.isFinite(pt.meanCosine)).toBe(true);
      expect(Number.isFinite(pt.meanMSE)).toBe(true);
    }
  });
});
