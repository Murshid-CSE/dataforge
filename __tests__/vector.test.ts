import { describe, it, expect } from 'vitest';
import {
  normalize,
  dot,
  add,
  subtract,
  scale,
  outerProduct,
  matVecMul,
  addMatrix,
  cosineSimilarity,
  mse,
  norm,
  zeros,
  zeroMatrix,
} from '../src/lib/vector';

describe('normalize', () => {
  it('produces a unit vector', () => {
    const v = [3, 4];
    const n = normalize(v);
    const len = Math.sqrt(n[0] ** 2 + n[1] ** 2);
    expect(len).toBeCloseTo(1.0, 10);
  });

  it('preserves direction', () => {
    const v = [3, 4];
    const n = normalize(v);
    expect(n[0]).toBeCloseTo(0.6, 10);
    expect(n[1]).toBeCloseTo(0.8, 10);
  });

  it('returns zero vector for zero input', () => {
    const v = [0, 0, 0];
    const n = normalize(v);
    expect(n).toEqual([0, 0, 0]);
  });

  it('normalizes higher-dimensional vectors', () => {
    const v = [1, 1, 1, 1];
    const n = normalize(v);
    const expected = 1 / 2; // 1 / sqrt(4)
    for (const x of n) {
      expect(x).toBeCloseTo(expected, 10);
    }
  });
});

describe('dot', () => {
  it('computes the dot product correctly', () => {
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32);
  });

  it('returns 0 for orthogonal vectors', () => {
    expect(dot([1, 0], [0, 1])).toBe(0);
  });

  it('returns 1 for identical unit vectors', () => {
    const v = normalize([1, 1]);
    expect(dot(v, v)).toBeCloseTo(1.0, 10);
  });
});

describe('outerProduct', () => {
  it('computes v ⊗ k correctly for basis vectors', () => {
    const result = outerProduct([1, 0], [0, 1]);
    expect(result).toEqual([
      [0, 1],
      [0, 0],
    ]);
  });

  it('computes v ⊗ k correctly for general vectors', () => {
    const result = outerProduct([2, 3], [4, 5]);
    expect(result).toEqual([
      [8, 10],
      [12, 15],
    ]);
  });

  it('produces a matrix of correct dimensions', () => {
    const result = outerProduct([1, 2, 3], [4, 5]);
    expect(result.length).toBe(3);
    expect(result[0].length).toBe(2);
  });
});

describe('matVecMul', () => {
  it('computes M q correctly', () => {
    const M = [
      [1, 2],
      [3, 4],
    ];
    const q = [5, 6];
    expect(matVecMul(M, q)).toEqual([17, 39]);
  });

  it('returns zero for zero matrix', () => {
    const M = zeroMatrix(2, 2);
    expect(matVecMul(M, [1, 2])).toEqual([0, 0]);
  });
});

describe('addMatrix', () => {
  it('adds two matrices element-wise', () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    const B = [
      [5, 6],
      [7, 8],
    ];
    expect(addMatrix(A, B)).toEqual([
      [6, 8],
      [10, 12],
    ]);
  });
});

describe('cosineSimilarity', () => {
  it('returns 1 for identical vectors', () => {
    const v = [1, 2, 3];
    expect(cosineSimilarity(v, v)).toBeCloseTo(1.0, 10);
  });

  it('returns -1 for opposite vectors', () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1.0, 10);
  });

  it('returns 0 for orthogonal vectors', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0.0, 10);
  });

  it('returns 0 for zero vectors', () => {
    expect(cosineSimilarity([0, 0], [1, 2])).toBe(0);
  });
});

describe('mse', () => {
  it('returns 0 for identical vectors', () => {
    expect(mse([1, 2, 3], [1, 2, 3])).toBe(0);
  });

  it('computes MSE correctly', () => {
    // diff = [1, 1], squares = [1, 1], mean = 1
    expect(mse([1, 2], [2, 3])).toBe(1);
  });

  it('computes MSE for non-trivial case', () => {
    // diff = [2, -2], squares = [4, 4], mean = 4
    expect(mse([3, 5], [1, 7])).toBe(4);
  });
});

describe('add and subtract', () => {
  it('add works', () => {
    expect(add([1, 2], [3, 4])).toEqual([4, 6]);
  });

  it('subtract works', () => {
    expect(subtract([5, 7], [2, 3])).toEqual([3, 4]);
  });
});

describe('scale', () => {
  it('scales a vector', () => {
    expect(scale([1, 2, 3], 2)).toEqual([2, 4, 6]);
  });

  it('scales by zero', () => {
    expect(scale([1, 2, 3], 0)).toEqual([0, 0, 0]);
  });
});
