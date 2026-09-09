/**
 * Pure vector and matrix operations for associative memory computation.
 *
 * All functions are pure (no side effects).
 * Vectors are represented as number[].
 * Matrices are represented as number[][] (row-major: M[row][col]).
 */

/** Create a zero vector of length d. */
export function zeros(d: number): number[] {
  return new Array(d).fill(0);
}

/** Create a zero matrix of shape rows × cols. */
export function zeroMatrix(rows: number, cols: number): number[][] {
  const M: number[][] = new Array(rows);
  for (let i = 0; i < rows; i++) {
    M[i] = new Array(cols).fill(0);
  }
  return M;
}

/** L2 norm of a vector. */
export function norm(v: number[]): number {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    sum += v[i] * v[i];
  }
  return Math.sqrt(sum);
}

/** Normalize a vector to unit length. Returns a new vector.
 *  If the vector is zero, returns a zero vector (avoids division by zero). */
export function normalize(v: number[]): number[] {
  const n = norm(v);
  if (n === 0) return v.slice();
  const result = new Array(v.length);
  for (let i = 0; i < v.length; i++) {
    result[i] = v[i] / n;
  }
  return result;
}

/** Dot product of two vectors. Assumes equal length. */
export function dot(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/** Element-wise addition of two vectors. Returns a new vector. */
export function add(a: number[], b: number[]): number[] {
  const result = new Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] + b[i];
  }
  return result;
}

/** Element-wise subtraction: a - b. Returns a new vector. */
export function subtract(a: number[], b: number[]): number[] {
  const result = new Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] - b[i];
  }
  return result;
}

/** Scale a vector by a scalar. Returns a new vector. */
export function scale(v: number[], s: number): number[] {
  const result = new Array(v.length);
  for (let i = 0; i < v.length; i++) {
    result[i] = v[i] * s;
  }
  return result;
}

/**
 * Outer product: v ⊗ k → matrix M where M[i][j] = v[i] * k[j].
 * Returns a new matrix of shape (v.length × k.length).
 */
export function outerProduct(v: number[], k: number[]): number[][] {
  const rows = v.length;
  const cols = k.length;
  const M: number[][] = new Array(rows);
  for (let i = 0; i < rows; i++) {
    M[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      M[i][j] = v[i] * k[j];
    }
  }
  return M;
}

/**
 * Matrix-vector multiplication: M q → result vector.
 * M is (rows × cols), q is (cols). Returns vector of length rows.
 */
export function matVecMul(M: number[][], q: number[]): number[] {
  const rows = M.length;
  const cols = M[0].length;
  const result = new Array(rows);
  for (let i = 0; i < rows; i++) {
    let sum = 0;
    for (let j = 0; j < cols; j++) {
      sum += M[i][j] * q[j];
    }
    result[i] = sum;
  }
  return result;
}

/**
 * Add two matrices element-wise. Returns a new matrix.
 */
export function addMatrix(A: number[][], B: number[][]): number[][] {
  const rows = A.length;
  const cols = A[0].length;
  const R: number[][] = new Array(rows);
  for (let i = 0; i < rows; i++) {
    R[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
      R[i][j] = A[i][j] + B[i][j];
    }
  }
  return R;
}

/**
 * Cosine similarity between two vectors.
 * Returns a value in [-1, 1].
 * If either vector is zero, returns 0.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const normA = norm(a);
  const normB = norm(b);
  if (normA === 0 || normB === 0) return 0;
  return dot(a, b) / (normA * normB);
}

/**
 * Mean squared error between two vectors.
 */
export function mse(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return sum / a.length;
}
