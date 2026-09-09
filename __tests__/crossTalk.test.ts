import { describe, it, expect } from 'vitest';
import { decomposeCrossTalk, crossTalkRatio } from '../src/lib/crossTalk';
import { buildMemory, retrieve } from '../src/lib/associativeMemory';
import { cosineSimilarity, norm, add } from '../src/lib/vector';

describe('decomposeCrossTalk', () => {
  it('shows zero cross-talk for orthogonal keys', () => {
    const keys = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ];
    const values = [
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    const M = buildMemory(keys, values, 'hebbian');
    const retrieved = retrieve(M, keys[0]);
    const decomp = decomposeCrossTalk(keys, values, 0, retrieved);

    // Target contribution should equal v1
    expect(decomp.targetContribution).toEqual([0, 0, 1, 0]);

    // Cross-talk should be zero
    expect(decomp.crossTalkTerms).toHaveLength(1);
    expect(decomp.crossTalkTerms[0].overlap).toBeCloseTo(0, 10);
    for (const x of decomp.totalCrossTalk) {
      expect(x).toBeCloseTo(0, 10);
    }
  });

  it('shows non-zero cross-talk for overlapping keys', () => {
    const k1 = [1, 0, 0, 0];
    const k2_len = Math.sqrt(2);
    const k2 = [1 / k2_len, 1 / k2_len, 0, 0];

    const v1 = [0, 0, 1, 0];
    const v2 = [0, 0, 0, 1];

    const M = buildMemory([k1, k2], [v1, v2], 'hebbian');
    const retrieved = retrieve(M, k1);
    const decomp = decomposeCrossTalk([k1, k2], [v1, v2], 0, retrieved);

    // Cross-talk term from k2
    const expectedOverlap = 1 / Math.sqrt(2);
    expect(decomp.crossTalkTerms[0].overlap).toBeCloseTo(expectedOverlap, 8);
    expect(decomp.crossTalkTerms[0].sourceIndex).toBe(1);

    // Total cross-talk should be v2 * overlap
    expect(decomp.totalCrossTalk[3]).toBeCloseTo(expectedOverlap, 8);
  });

  it('target + cross-talk sums to retrieved (Hebbian case)', () => {
    const k1 = [1, 0, 0, 0];
    const k2_len = Math.sqrt(2);
    const k2 = [1 / k2_len, 1 / k2_len, 0, 0];

    const v1 = [0, 0, 1, 0];
    const v2 = [0, 0, 0, 1];

    const M = buildMemory([k1, k2], [v1, v2], 'hebbian');
    const retrieved = retrieve(M, k1);
    const decomp = decomposeCrossTalk([k1, k2], [v1, v2], 0, retrieved);

    // For Hebbian: retrieved = target + total_cross_talk
    const reconstructed = add(decomp.targetContribution, decomp.totalCrossTalk);
    for (let i = 0; i < 4; i++) {
      expect(reconstructed[i]).toBeCloseTo(retrieved[i], 8);
    }
  });
});

describe('crossTalkRatio', () => {
  it('returns 0 for no cross-talk', () => {
    const keys = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ];
    const values = [
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    const M = buildMemory(keys, values, 'hebbian');
    const retrieved = retrieve(M, keys[0]);
    const decomp = decomposeCrossTalk(keys, values, 0, retrieved);

    expect(crossTalkRatio(decomp)).toBeCloseTo(0, 8);
  });

  it('returns positive value for overlapping keys', () => {
    const k1 = [1, 0, 0, 0];
    const k2_len = Math.sqrt(2);
    const k2 = [1 / k2_len, 1 / k2_len, 0, 0];

    const v1 = [0, 0, 1, 0];
    const v2 = [0, 0, 0, 1];

    const M = buildMemory([k1, k2], [v1, v2], 'hebbian');
    const retrieved = retrieve(M, k1);
    const decomp = decomposeCrossTalk([k1, k2], [v1, v2], 0, retrieved);

    expect(crossTalkRatio(decomp)).toBeGreaterThan(0);
  });
});
