import { describe, it, expect } from 'vitest';
import {
  hebbianWrite,
  deltaWrite,
  retrieve,
  buildMemory,
} from '../src/lib/associativeMemory';
import { zeroMatrix, cosineSimilarity, norm } from '../src/lib/vector';

describe('hebbianWrite', () => {
  it('writes v k^T into a zero matrix', () => {
    const M = zeroMatrix(4, 4);
    const v = [0, 0, 1, 0];
    const k = [1, 0, 0, 0];

    const result = hebbianWrite(M, v, k);

    // v k^T should place v[i] * k[j] into result[i][j]
    // Row 2 should be [1, 0, 0, 0], all other rows zero
    expect(result[0]).toEqual([0, 0, 0, 0]);
    expect(result[1]).toEqual([0, 0, 0, 0]);
    expect(result[2]).toEqual([1, 0, 0, 0]);
    expect(result[3]).toEqual([0, 0, 0, 0]);
  });
});

describe('retrieve', () => {
  it('retrieves the correct value from a single-association memory', () => {
    const M = zeroMatrix(4, 4);
    const v = [0, 0, 1, 0];
    const k = [1, 0, 0, 0];

    const newM = hebbianWrite(M, v, k);
    const retrieved = retrieve(newM, k);

    expect(retrieved).toEqual([0, 0, 1, 0]);
  });
});

describe('hand-checkable orthogonal fixture', () => {
  /**
   * HAND-CHECKABLE TEST:
   *
   * d = 4
   * k1 = [1, 0, 0, 0]
   * k2 = [0, 1, 0, 0]
   * v1 = [0, 0, 1, 0]
   * v2 = [0, 0, 0, 1]
   *
   * M = v1 k1^T + v2 k2^T =
   * [[0,0,0,0],
   *  [0,0,0,0],
   *  [1,0,0,0],
   *  [0,1,0,0]]
   *
   * retrieve(M, k1) = [0, 0, 1, 0] = v1 ✓
   * retrieve(M, k2) = [0, 0, 0, 1] = v2 ✓
   *
   * Cosine similarity should be 1.0 for both.
   */
  it('two orthogonal keys recover exactly with Hebbian rule', () => {
    const k1 = [1, 0, 0, 0];
    const k2 = [0, 1, 0, 0];
    const v1 = [0, 0, 1, 0];
    const v2 = [0, 0, 0, 1];

    const keys = [k1, k2];
    const values = [v1, v2];

    const M = buildMemory(keys, values, 'hebbian');

    // Verify memory matrix
    expect(M[0]).toEqual([0, 0, 0, 0]);
    expect(M[1]).toEqual([0, 0, 0, 0]);
    expect(M[2]).toEqual([1, 0, 0, 0]);
    expect(M[3]).toEqual([0, 1, 0, 0]);

    // Verify retrieval
    const r1 = retrieve(M, k1);
    const r2 = retrieve(M, k2);

    expect(r1).toEqual(v1);
    expect(r2).toEqual(v2);

    // Verify cosine similarity = 1.0
    expect(cosineSimilarity(v1, r1)).toBeCloseTo(1.0, 10);
    expect(cosineSimilarity(v2, r2)).toBeCloseTo(1.0, 10);
  });

  it('two non-orthogonal keys produce cross-talk with Hebbian rule', () => {
    // k1 and k2 share overlap → cross-talk expected
    const k1 = [1, 0, 0, 0];
    const k2_raw = [1, 1, 0, 0]; // Not orthogonal to k1
    const k2_norm = Math.sqrt(2);
    const k2 = k2_raw.map((x) => x / k2_norm);

    const v1 = [0, 0, 1, 0];
    const v2 = [0, 0, 0, 1];

    const M = buildMemory([k1, k2], [v1, v2], 'hebbian');

    // Retrieve with k1
    const r1 = retrieve(M, k1);

    // r1 should be v1 + v2 * (k2 · k1)
    // k2 · k1 = 1/sqrt(2) ≈ 0.7071
    const overlap = 1 / Math.sqrt(2);
    const expectedR1 = [
      0 + 0 * overlap,  // v1[0] + v2[0] * overlap
      0 + 0 * overlap,  // v1[1] + v2[1] * overlap
      1 + 0 * overlap,  // v1[2] + v2[2] * overlap
      0 + 1 * overlap,  // v1[3] + v2[3] * overlap
    ];

    for (let i = 0; i < 4; i++) {
      expect(r1[i]).toBeCloseTo(expectedR1[i], 8);
    }

    // Cosine similarity should be less than 1 due to cross-talk
    const cos = cosineSimilarity(v1, r1);
    expect(cos).toBeLessThan(1.0);
    expect(cos).toBeGreaterThan(0.5); // Still somewhat correct
  });
});

describe('deltaWrite', () => {
  it('single delta write with beta=1 stores v exactly for a zero matrix', () => {
    const M = zeroMatrix(4, 4);
    const v = [0.5, 0.3, 0.8, 0.1];
    const k = [1, 0, 0, 0]; // Unit basis vector

    const newM = deltaWrite(M, v, k, 1.0);
    const retrieved = retrieve(newM, k);

    for (let i = 0; i < 4; i++) {
      expect(retrieved[i]).toBeCloseTo(v[i], 10);
    }
  });

  it('delta rule corrects toward desired value on update', () => {
    // Write v1 for k, then overwrite with v2 for same k
    const k = [1, 0, 0, 0];
    const v1 = [1, 0, 0, 0];
    const v2 = [0, 1, 0, 0];

    let M = zeroMatrix(4, 4);
    M = deltaWrite(M, v1, k, 1.0);
    M = deltaWrite(M, v2, k, 1.0);

    const retrieved = retrieve(M, k);

    // With beta=1, delta rule on same key should overwrite:
    // After first write: M k = v1
    // Second write: M = M + (v2 - M k) k^T = M + (v2 - v1) k^T
    // So M k = v1 + (v2 - v1) = v2
    for (let i = 0; i < 4; i++) {
      expect(retrieved[i]).toBeCloseTo(v2[i], 10);
    }
  });
});

describe('buildMemory', () => {
  it('builds Hebbian memory sequentially', () => {
    const keys = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ];
    const values = [
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    const M = buildMemory(keys, values, 'hebbian');

    // Same as the hand-checkable fixture
    expect(M[2][0]).toBe(1);
    expect(M[3][1]).toBe(1);
  });

  it('builds delta memory', () => {
    const keys = [[1, 0, 0, 0]];
    const values = [[0.5, 0.3, 0.8, 0.1]];

    const M = buildMemory(keys, values, 'delta', 1.0);
    const retrieved = retrieve(M, keys[0]);

    for (let i = 0; i < 4; i++) {
      expect(retrieved[i]).toBeCloseTo(values[0][i], 10);
    }
  });
});
