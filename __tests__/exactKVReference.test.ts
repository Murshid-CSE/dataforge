import { describe, it, expect } from 'vitest';
import { createExactKVStore, exactRetrieve, exactRetrieveByIndex } from '../src/lib/exactKVReference';

describe('exactKVReference', () => {
  const keys = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  const values = [
    [0.1, 0.2, 0.3],
    [0.4, 0.5, 0.6],
    [0.7, 0.8, 0.9],
  ];

  it('retrieves exact value for stored key', () => {
    const store = createExactKVStore(keys, values);
    const result = exactRetrieve(store, [1, 0, 0]);
    expect(result).toEqual([0.1, 0.2, 0.3]);
  });

  it('retrieves the closest value for a query between two keys', () => {
    const store = createExactKVStore(keys, values);
    // Query closer to key[0] = [1,0,0]
    const result = exactRetrieve(store, [0.9, 0.1, 0]);
    expect(result).toEqual([0.1, 0.2, 0.3]);
  });

  it('retrieves by index correctly', () => {
    const store = createExactKVStore(keys, values);
    expect(exactRetrieveByIndex(store, 0)).toEqual([0.1, 0.2, 0.3]);
    expect(exactRetrieveByIndex(store, 1)).toEqual([0.4, 0.5, 0.6]);
    expect(exactRetrieveByIndex(store, 2)).toEqual([0.7, 0.8, 0.9]);
  });

  it('returns copies (immutability)', () => {
    const store = createExactKVStore(keys, values);
    const r1 = exactRetrieveByIndex(store, 0);
    r1[0] = 999;
    const r2 = exactRetrieveByIndex(store, 0);
    expect(r2[0]).toBe(0.1); // Original unchanged
  });

  it('throws on empty store', () => {
    const store = createExactKVStore([], []);
    expect(() => exactRetrieve(store, [1, 0, 0])).toThrow();
  });

  it('throws on out-of-bounds index', () => {
    const store = createExactKVStore(keys, values);
    expect(() => exactRetrieveByIndex(store, 5)).toThrow();
    expect(() => exactRetrieveByIndex(store, -1)).toThrow();
  });
});
