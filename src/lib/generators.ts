/**
 * Key and value generators for associative memory experiments.
 *
 * Keys are always L2-normalized.
 * The ρ (rho) parameter controls expected pairwise overlap/correlation
 * among generated keys. It is an educational toy parameter, not an exact
 * specification of every pairwise cosine similarity.
 *
 * Construction for correlated keys:
 *   k_i = normalize( sqrt(ρ) * shared_direction + sqrt(1 - ρ) * random_direction_i )
 *
 * When ρ = 0: keys are random unit vectors (not guaranteed orthogonal —
 * their actual overlap depends on dimensionality and chance).
 * When ρ > 0: keys share a common component, increasing expected overlap.
 */

import { seededGaussianArray } from './random';
import { normalize } from './vector';

/**
 * Generate n normalized key vectors of dimension d with controllable overlap.
 *
 * @param n - Number of keys to generate
 * @param d - Dimension of each key
 * @param rho - Overlap/correlation parameter in [0, 0.9].
 *              Controls expected pairwise cosine similarity.
 *              ρ=0 gives approximately uncorrelated random keys.
 *              Higher ρ increases the shared-direction component.
 * @param rng - Seeded PRNG function returning floats in [0, 1)
 * @returns Array of n normalized key vectors
 */
export function generateKeys(
  n: number,
  d: number,
  rho: number,
  rng: () => number
): number[][] {
  // Clamp rho to valid range
  const clampedRho = Math.max(0, Math.min(0.9, rho));

  // Generate a shared direction (always generated to keep PRNG sequence consistent)
  const sharedRaw = seededGaussianArray(d, rng);
  const sharedDir = normalize(sharedRaw);

  const keys: number[][] = new Array(n);

  for (let i = 0; i < n; i++) {
    const randomRaw = seededGaussianArray(d, rng);
    const randomDir = normalize(randomRaw);

    if (clampedRho === 0) {
      // Pure random unit vectors — no shared component
      keys[i] = randomDir;
    } else {
      // k_i = normalize( sqrt(ρ) * shared + sqrt(1-ρ) * random_i )
      const sqrtRho = Math.sqrt(clampedRho);
      const sqrtOneMinusRho = Math.sqrt(1 - clampedRho);

      const combined = new Array(d);
      for (let j = 0; j < d; j++) {
        combined[j] = sqrtRho * sharedDir[j] + sqrtOneMinusRho * randomDir[j];
      }
      keys[i] = normalize(combined);
    }
  }

  return keys;
}

/**
 * Generate n normalized value vectors of dimension d.
 * Values are random unit vectors with no correlation control.
 *
 * @param n - Number of values to generate
 * @param d - Dimension of each value
 * @param rng - Seeded PRNG function
 * @returns Array of n normalized value vectors
 */
export function generateValues(
  n: number,
  d: number,
  rng: () => number
): number[][] {
  const values: number[][] = new Array(n);
  for (let i = 0; i < n; i++) {
    const raw = seededGaussianArray(d, rng);
    values[i] = normalize(raw);
  }
  return values;
}

/**
 * Compute the mean pairwise cosine similarity across all key pairs.
 * Returns 0 if fewer than 2 keys.
 */
export function meanPairwiseCosine(keys: number[][]): number {
  const n = keys.length;
  if (n < 2) return 0;

  let sum = 0;
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Keys are already normalized, so cosine = dot product
      let dp = 0;
      for (let k = 0; k < keys[i].length; k++) {
        dp += keys[i][k] * keys[j][k];
      }
      sum += Math.abs(dp); // Use absolute value since direction doesn't matter for overlap
      count++;
    }
  }
  return sum / count;
}
