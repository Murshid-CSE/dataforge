import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { runExperiment } from '../src/lib/experiments';
import { add, subtract, norm } from '../src/lib/vector';

describe('Evidence Acceptance Tests & Numerical Records', () => {
  const evidenceRecords: Record<string, unknown> = {};

  it('generates and records all acceptance test metrics', () => {
    // Test 1: Low-overlap regime
    const test1 = runExperiment({
      seed: 42,
      d: 16,
      N: 4,
      rho: 0.0,
      rule: 'hebbian',
    });
    evidenceRecords.test1 = {
      seed: 42,
      d: 16,
      N: 4,
      rho: 0.0,
      rule: 'hebbian',
      measuredMeanKeyCosine: test1.measuredMeanPairwiseCosine,
      meanCosine: test1.aggregate.meanCosine,
      meanMSE: test1.aggregate.meanMSE,
    };

    // Test 2: Key-overlap intervention
    const test2Low = runExperiment({
      seed: 42,
      d: 8,
      N: 12,
      rho: 0.1,
      rule: 'hebbian',
    });
    const test2High = runExperiment({
      seed: 42,
      d: 8,
      N: 12,
      rho: 0.8,
      rule: 'hebbian',
    });
    evidenceRecords.test2 = {
      seed: 42,
      d: 8,
      N: 12,
      rule: 'hebbian',
      lowOverlap: {
        configuredRho: 0.1,
        measuredKeyOverlap: test2Low.measuredMeanPairwiseCosine,
        meanCosine: test2Low.aggregate.meanCosine,
        meanMSE: test2Low.aggregate.meanMSE,
      },
      highOverlap: {
        configuredRho: 0.8,
        measuredKeyOverlap: test2High.measuredMeanPairwiseCosine,
        meanCosine: test2High.aggregate.meanCosine,
        meanMSE: test2High.aggregate.meanMSE,
      },
    };

    // Test 3: Memory pressure sweep
    const nValues = [2, 4, 8, 16, 24, 32, 48, 64];
    const test3Records = nValues.map((n) => {
      const res = runExperiment({ seed: 42, d: 8, N: n, rho: 0.2, rule: 'hebbian' });
      return {
        N: n,
        measuredKeyOverlap: res.measuredMeanPairwiseCosine,
        meanCosine: res.aggregate.meanCosine,
        meanMSE: res.aggregate.meanMSE,
      };
    });
    evidenceRecords.test3 = {
      seed: 42,
      d: 8,
      rho: 0.2,
      rule: 'hebbian',
      sweep: test3Records,
    };

    // Test 4: Update-rule comparison (Hebbian vs Delta)
    const test4Hebbian = runExperiment({
      seed: 42,
      d: 8,
      N: 16,
      rho: 0.3,
      rule: 'hebbian',
    });
    const test4Delta = runExperiment({
      seed: 42,
      d: 8,
      N: 16,
      rho: 0.3,
      rule: 'delta',
      beta: 1.0,
    });
    evidenceRecords.test4 = {
      seed: 42,
      d: 8,
      N: 16,
      rho: 0.3,
      hebbian: {
        meanCosine: test4Hebbian.aggregate.meanCosine,
        meanMSE: test4Hebbian.aggregate.meanMSE,
      },
      delta: {
        beta: 1.0,
        meanCosine: test4Delta.aggregate.meanCosine,
        meanMSE: test4Delta.aggregate.meanMSE,
      },
    };

    // Test 5: Reproducibility verification
    const config5 = { seed: 12345, d: 16, N: 8, rho: 0.4, rule: 'hebbian' as const };
    const run1 = runExperiment(config5);
    const run2 = runExperiment(config5);
    evidenceRecords.test5 = {
      run1MSE: run1.aggregate.meanMSE,
      run2MSE: run2.aggregate.meanMSE,
      isIdenticalBitForBit: run1.aggregate.meanMSE === run2.aggregate.meanMSE,
    };

    // Cross-talk decomposition exactness
    const ctRes = runExperiment({
      seed: 42,
      d: 8,
      N: 6,
      rho: 0.3,
      rule: 'hebbian',
      selectedQueryIndex: 2,
    });
    const decomp = ctRes.crossTalkDecomposition;
    const reconstructed = add(decomp.targetContribution, decomp.totalCrossTalk);
    const diff = subtract(decomp.retrieved, reconstructed);
    const maxDiff = Math.max(...diff.map((x) => Math.abs(x)));

    evidenceRecords.crossTalkExactness = {
      queryIndex: 2,
      targetNorm: norm(decomp.targetContribution),
      crossTalkNorm: norm(decomp.totalCrossTalk),
      retrievedNorm: norm(decomp.retrieved),
      maxAbsoluteElementDifference: maxDiff,
      isExactToMachinePrecision: maxDiff < 1e-12,
    };

    // Write to evidence_data.json
    const outputPath = path.join(__dirname, 'evidence_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(evidenceRecords, null, 2), 'utf-8');

    expect(test1.aggregate.meanCosine).toBeGreaterThan(0.8);
    expect(test2High.aggregate.meanMSE).toBeGreaterThan(test2Low.aggregate.meanMSE);
    expect(maxDiff).toBeLessThan(1e-12);
  });
});
