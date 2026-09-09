/**
 * Seeded deterministic pseudo-random number generator.
 *
 * Uses Mulberry32 — a simple, high-quality 32-bit PRNG.
 * Identical seeds produce identical sequences.
 */

/**
 * Create a deterministic PRNG from an integer seed.
 * Returns a function that yields floats in [0, 1) on each call.
 */
export function mulberry32(seed: number): () => number {
  let state = seed | 0; // coerce to 32-bit integer
  return (): number => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a single sample from a standard normal distribution
 * using the Box-Muller transform.
 */
export function seededGaussian(rng: () => number): number {
  // Box-Muller requires two uniform samples
  let u1 = rng();
  const u2 = rng();
  // Guard against log(0)
  while (u1 === 0) u1 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Generate an array of n standard-normal samples.
 */
export function seededGaussianArray(n: number, rng: () => number): number[] {
  const result: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = seededGaussian(rng);
  }
  return result;
}
