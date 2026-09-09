import { describe, it, expect } from 'vitest';
import { retrievalQuality, aggregateQuality } from '../src/lib/metrics';
import { buildMemory, retrieve } from '../src/lib/associativeMemory';

describe('retrievalQuality', () => {
  it('returns cosine=1 and mse=0 for perfect retrieval', () => {
    const v = [0.6, 0.8];
    const q = retrievalQuality(v, v);
    expect(q.cosine).toBeCloseTo(1.0, 10);
    expect(q.mse).toBeCloseTo(0.0, 10);
  });

  it('returns lower cosine for imperfect retrieval', () => {
    const truth = [1, 0, 0, 0];
    const retrieved = [0.8, 0.2, 0.1, 0.05];
    const q = retrievalQuality(truth, retrieved);
    expect(q.cosine).toBeLessThan(1.0);
    expect(q.cosine).toBeGreaterThan(0.5);
    expect(q.mse).toBeGreaterThan(0);
  });
});

describe('aggregateQuality', () => {
  it('computes aggregate quality for orthogonal keys (perfect retrieval)', () => {
    const keys = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ];
    const values = [
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    const M = buildMemory(keys, values, 'hebbian');
    const agg = aggregateQuality(keys, values, M, retrieve);

    expect(agg.meanCosine).toBeCloseTo(1.0, 10);
    expect(agg.meanMSE).toBeCloseTo(0.0, 10);
    expect(agg.perQuery).toHaveLength(2);
    expect(agg.perQuery[0].cosine).toBeCloseTo(1.0, 10);
    expect(agg.perQuery[1].cosine).toBeCloseTo(1.0, 10);
  });

  it('shows reduced quality when keys overlap', () => {
    const k1 = [1, 0, 0, 0];
    const k2_len = Math.sqrt(2);
    const k2 = [1 / k2_len, 1 / k2_len, 0, 0];

    const v1 = [0, 0, 1, 0];
    const v2 = [0, 0, 0, 1];

    const M = buildMemory([k1, k2], [v1, v2], 'hebbian');
    const agg = aggregateQuality([k1, k2], [v1, v2], M, retrieve);

    // With overlapping keys, mean cosine should be less than 1
    expect(agg.meanCosine).toBeLessThan(1.0);
    expect(agg.meanMSE).toBeGreaterThan(0);
  });
});
