import { describe, it, expect } from 'vitest';
import { SCENARIOS, evaluateScenario } from '../src/lib/scenarios';

describe('Scenarios Module', () => {
  it('defines the three required engineering scenarios with 24 facts each', () => {
    const keys = Object.keys(SCENARIOS);
    expect(keys).toContain('ai-agent');
    expect(keys).toContain('customer-support');
    expect(keys).toContain('sensor-stream');

    for (const key of keys) {
      const scenario = SCENARIOS[key];
      expect(scenario.name.length).toBeGreaterThan(0);
      expect(scenario.facts.length).toBe(24);
      expect(scenario.queries.length).toBeGreaterThanOrEqual(5);
      expect(scenario.defaultD).toBe(8);
      expect(scenario.defaultN).toBe(16);
    }
  });

  it('runs a deterministic scenario evaluation producing valid health and risk scores', () => {
    const evalResult = evaluateScenario('ai-agent', 8, 16, 0.2, 'hebbian', 42);

    expect(evalResult.scenario.id).toBe('ai-agent');
    expect(evalResult.d).toBe(8);
    expect(evalResult.N).toBe(16);
    expect(evalResult.healthScore).toBeGreaterThanOrEqual(0);
    expect(evalResult.healthScore).toBeLessThanOrEqual(100);
    expect(evalResult.factResults.length).toBe(16);

    // Sum of safe, degraded, corrupted must equal N
    expect(evalResult.safeCount + evalResult.degradedCount + evalResult.highRiskCount).toBe(16);

    // Check that most vulnerable are correctly ordered
    if (evalResult.mostVulnerable.length >= 2) {
      expect(evalResult.mostVulnerable[0].cosine).toBeLessThanOrEqual(evalResult.mostVulnerable[1].cosine);
    }
  });

  it('demonstrates that higher key overlap in Customer Support scenario degrades memory health', () => {
    const lowOverlap = evaluateScenario('customer-support', 8, 12, 0.1, 'hebbian', 42);
    const highOverlap = evaluateScenario('customer-support', 8, 12, 0.8, 'hebbian', 42);

    // Higher key overlap should increase measured overlap and reduce health score
    expect(highOverlap.measuredKeyOverlap).toBeGreaterThan(lowOverlap.measuredKeyOverlap);
    expect(highOverlap.healthScore).toBeLessThan(lowOverlap.healthScore);
    expect(highOverlap.highRiskCount).toBeGreaterThanOrEqual(lowOverlap.highRiskCount);
  });

  it('generates toy-model diagnostics and suggested experiments when memory has high compression', () => {
    // 24 associations in d=4
    const saturated = evaluateScenario('sensor-stream', 4, 24, 0.2, 'hebbian', 42);

    expect(saturated.recommendation.headline).toContain('Toy-Model Diagnostic');
    expect(saturated.recommendation.details).toContain('Suggested experiment');
    expect(saturated.recommendation.suggestedAction).toBe('increase_d');
  });

  it('provides exact top interfering facts for each evaluated memory', () => {
    const evalResult = evaluateScenario('ai-agent', 8, 10, 0.3, 'hebbian', 42);

    for (const factRes of evalResult.factResults) {
      expect(factRes.topInterferingFacts.length).toBeLessThanOrEqual(3);
      for (const interfering of factRes.topInterferingFacts) {
        expect(interfering.factKey).not.toBe(factRes.fact.key);
        expect(typeof interfering.overlap).toBe('number');
        expect(typeof interfering.contributionMagnitude).toBe('number');
      }
    }
  });
});
