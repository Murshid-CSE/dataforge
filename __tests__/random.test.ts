import { describe, it, expect } from 'vitest';
import { mulberry32, seededGaussian, seededGaussianArray } from '../src/lib/random';

describe('mulberry32', () => {
  it('produces deterministic sequences from the same seed', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);

    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());

    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences from different seeds', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(99);

    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());

    expect(seq1).not.toEqual(seq2);
  });

  it('produces values in [0, 1)', () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 1000; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
});

describe('seededGaussian', () => {
  it('produces deterministic values from the same PRNG state', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);

    const val1 = seededGaussian(rng1);
    const val2 = seededGaussian(rng2);

    expect(val1).toBe(val2);
  });

  it('produces approximately standard-normal samples', () => {
    const rng = mulberry32(42);
    const samples = Array.from({ length: 10000 }, () => seededGaussian(rng));

    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance =
      samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;

    // Loose bounds — just a sanity check, not a rigorous statistical test
    expect(Math.abs(mean)).toBeLessThan(0.05);
    expect(Math.abs(variance - 1)).toBeLessThan(0.1);
  });
});

describe('seededGaussianArray', () => {
  it('produces the correct length', () => {
    const rng = mulberry32(42);
    const arr = seededGaussianArray(16, rng);
    expect(arr).toHaveLength(16);
  });

  it('is deterministic', () => {
    const arr1 = seededGaussianArray(8, mulberry32(99));
    const arr2 = seededGaussianArray(8, mulberry32(99));
    expect(arr1).toEqual(arr2);
  });
});
