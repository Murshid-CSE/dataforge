import { describe, it, expect } from 'vitest';
import { generateKeys, generateValues, meanPairwiseCosine } from '../src/lib/generators';
import { mulberry32 } from '../src/lib/random';
import { norm, dot } from '../src/lib/vector';

describe('generateKeys', () => {
  it('produces the correct number of keys', () => {
    const rng = mulberry32(42);
    const keys = generateKeys(10, 8, 0, rng);
    expect(keys).toHaveLength(10);
  });

  it('produces keys of the correct dimension', () => {
    const rng = mulberry32(42);
    const keys = generateKeys(5, 16, 0, rng);
    for (const k of keys) {
      expect(k).toHaveLength(16);
    }
  });

  it('produces normalized keys (unit length)', () => {
    const rng = mulberry32(42);
    const keys = generateKeys(20, 8, 0.5, rng);
    for (const k of keys) {
      expect(norm(k)).toBeCloseTo(1.0, 8);
    }
  });

  it('is deterministic: same seed → same keys', () => {
    const keys1 = generateKeys(5, 8, 0.3, mulberry32(42));
    const keys2 = generateKeys(5, 8, 0.3, mulberry32(42));
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 8; j++) {
        expect(keys1[i][j]).toBe(keys2[i][j]);
      }
    }
  });

  it('produces higher mean pairwise cosine when rho is higher', () => {
    const keysLow = generateKeys(20, 16, 0.0, mulberry32(42));
    const keysHigh = generateKeys(20, 16, 0.8, mulberry32(42));

    const meanLow = meanPairwiseCosine(keysLow);
    const meanHigh = meanPairwiseCosine(keysHigh);

    // Higher rho should produce more correlated keys
    expect(meanHigh).toBeGreaterThan(meanLow);
  });

  it('rho=0 keys are not assumed orthogonal — actual overlap is measured', () => {
    // With d=4 and N=4, random keys will typically have non-zero overlap
    const keys = generateKeys(4, 4, 0, mulberry32(42));
    const meanCos = meanPairwiseCosine(keys);
    // Just verify it's a real number — we make no guarantee of orthogonality
    expect(meanCos).toBeGreaterThanOrEqual(0);
    expect(meanCos).toBeLessThanOrEqual(1);
  });
});

describe('generateValues', () => {
  it('produces normalized value vectors', () => {
    const rng = mulberry32(42);
    const values = generateValues(10, 8, rng);
    for (const v of values) {
      expect(norm(v)).toBeCloseTo(1.0, 8);
    }
  });

  it('is deterministic', () => {
    const vals1 = generateValues(5, 8, mulberry32(99));
    const vals2 = generateValues(5, 8, mulberry32(99));
    expect(vals1).toEqual(vals2);
  });
});

describe('meanPairwiseCosine', () => {
  it('returns 0 for fewer than 2 keys', () => {
    expect(meanPairwiseCosine([])).toBe(0);
    expect(meanPairwiseCosine([[1, 0, 0]])).toBe(0);
  });

  it('returns 0 for perfectly orthogonal keys', () => {
    const keys = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    expect(meanPairwiseCosine(keys)).toBeCloseTo(0, 10);
  });

  it('returns 1 for identical keys', () => {
    const keys = [
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
    ];
    expect(meanPairwiseCosine(keys)).toBeCloseTo(1.0, 10);
  });
});
