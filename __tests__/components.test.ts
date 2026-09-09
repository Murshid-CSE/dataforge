import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import ErrorChart from '../src/components/ErrorChart';
import CrossTalkExplainer from '../src/components/CrossTalkExplainer';
import UpdateRuleComparison from '../src/components/UpdateRuleComparison';
import { BDHLens } from '../src/components/BDHLens';
import { Sources } from '../src/components/Sources';
import { ExactKVComparison } from '../src/components/ExactKVComparison';
import { ClaimHeader } from '../src/components/ClaimHeader';
import { Limitations } from '../src/components/Limitations';
import { ScenarioMode } from '../src/components/ScenarioMode';
import { runExperiment, runErrorVsNSweep } from '../src/lib/experiments';

describe('Component rendering tests', () => {
  const sampleConfig = {
    seed: 42,
    d: 8,
    N: 6,
    rho: 0.2,
    rule: 'hebbian' as const,
    selectedQueryIndex: 1,
  };
  const hebbianResult = runExperiment(sampleConfig);
  const deltaResult = runExperiment({ ...sampleConfig, rule: 'delta' as const });
  const sweepData = runErrorVsNSweep(42, 8, 0.2, 'hebbian', 10);

  describe('ClaimHeader', () => {
    it('renders central claim and technical boundaries', () => {
      const element = React.createElement(ClaimHeader);
      const html = renderToString(element);

      expect(html).toContain('MEMORY UNDER PRESSURE');
      expect(html).toContain('A fixed-size linear associative memory can process a stream of arbitrary length');
      expect(html).toContain('LIVE COMPUTATION');
      expect(html).toContain('EDUCATIONAL TOY MODEL');
    });
  });

  describe('ErrorChart', () => {
    it('renders without crashing with sweep data and correct labels', () => {
      const element = React.createElement(ErrorChart, {
        data: sweepData,
        currentN: 6,
        d: 8,
        rho: 0.2,
        rule: 'hebbian',
      });
      const html = renderToString(element);

      expect(html).toContain('Retrieval Error vs. Number of Associations');
      expect(html).toContain('Observed in this seeded experiment (d=8, ρ=0.20, hebbian)');
      expect(html).toContain('Retrieval Error (MSE)');
    });

    it('handles empty data gracefully', () => {
      const element = React.createElement(ErrorChart, {
        data: [],
        currentN: 1,
        d: 4,
        rho: 0,
        rule: 'delta',
      });
      const html = renderToString(element);

      expect(html).toContain('Retrieval Error vs. Number of Associations');
      expect(html).toContain('(d=4, ρ=0.00, delta)');
    });
  });

  describe('CrossTalkExplainer', () => {
    it('renders exact Hebbian decomposition, 3 blocks and contributors table for Hebbian', () => {
      const element = React.createElement(CrossTalkExplainer, {
        decomposition: hebbianResult.crossTalkDecomposition,
        queryIndex: 1,
        d: 8,
        rule: 'hebbian',
      });
      const html = renderToString(element);

      expect(html).toContain('Why Does Retrieval Differ from Ground Truth?');
      expect(html).toContain('Exact Hebbian decomposition');
      expect(html).toContain('TARGET CONTRIBUTION');
      expect(html).toContain('CROSS-TALK');
      expect(html).toContain('RETRIEVED');
      expect(html).toContain('cross-talk / interference');
      expect(html).toContain('Top Cross-Talk Contributors');
      expect(html).not.toContain('Cross-talk decomposition shown only for Hebbian memory');
    });

    it('renders the delta restriction notice when rule is delta without misusing additive decomposition', () => {
      const element = React.createElement(CrossTalkExplainer, {
        decomposition: deltaResult.crossTalkDecomposition,
        queryIndex: 0,
        d: 8,
        rule: 'delta',
      });
      const html = renderToString(element);

      expect(html).toContain('Why Does Retrieval Differ from Ground Truth?');
      expect(html).toContain('Delta mode (Non-linear update)');
      expect(html).toContain('Cross-talk decomposition shown only for Hebbian memory');
      expect(html).toContain('Delta Retrieved Vector');
    });

    it('handles single-item memory (N=1) gracefully without terms', () => {
      const singleItemResult = runExperiment({
        seed: 42,
        d: 4,
        N: 1,
        rho: 0,
        rule: 'hebbian',
      });

      const element = React.createElement(CrossTalkExplainer, {
        decomposition: singleItemResult.crossTalkDecomposition,
        queryIndex: 0,
        d: 4,
        rule: 'hebbian',
      });
      const html = renderToString(element);

      expect(html).toContain('Why Does Retrieval Differ from Ground Truth?');
      expect(html).toContain('No interfering associations stored (N = 1).');
    });
  });

  describe('ExactKVComparison', () => {
    it('renders Fixed Associative State vs Exact KV Reference comparison', () => {
      const element = React.createElement(ExactKVComparison, {
        queryIndex: 0,
        groundTruth: [1, 0, 0, 0],
        associativeRetrieved: [0.9, 0.1, 0, 0],
        exactKVRetrieved: [1, 0, 0, 0],
        associativeCosine: 0.99,
        exactKVCosine: 1.0,
        associativeMSE: 0.01,
        exactKVMSE: 0.0,
        N: 4,
        d: 4,
      });
      const html = renderToString(element);

      expect(html).toContain('Fixed Associative State vs Exact KV Reference');
      expect(html).toContain('Fixed Associative State');
      expect(html).toContain('Exact KV Reference');
      expect(html).toContain('Pedagogical exact-memory reference:');
    });
  });

  describe('UpdateRuleComparison', () => {
    it('renders side-by-side comparison with equations and metrics', () => {
      const element = React.createElement(UpdateRuleComparison, {
        primaryResult: hebbianResult,
        comparisonResult: deltaResult,
        queryIndex: 1,
      });
      const html = renderToString(element);

      expect(html).toContain('Update Rule Comparison');
      expect(html).toContain('Same data; different update rule.');
      expect(html).toContain('Hebbian Rule');
      expect(html).toContain('Delta Rule');
      expect(html).toContain('Retrieval Error (MSE)');
      expect(html).toContain('Mean Cosine');
      expect(html).toContain('The memory-update rule changes what information survives in the bounded state');
    });

    it('handles swapped primary and comparison results correctly', () => {
      const element = React.createElement(UpdateRuleComparison, {
        primaryResult: deltaResult,
        comparisonResult: hebbianResult,
        queryIndex: 0,
      });
      const html = renderToString(element);

      expect(html).toContain('Hebbian Rule');
      expect(html).toContain('Delta Rule');
      expect(html).toContain('Same data; different update rule.');
    });
  });

  describe('BDHLens', () => {
    it('renders the BDH primary source module with verified facts, equations, and badges', () => {
      const element = React.createElement(BDHLens);
      const html = renderToString(element);

      expect(html).toContain('From Fast Weights to Synapses: The BDH Lens');
      expect(html).toContain('PUBLISHED BDH FACTS');
      expect(html).toContain('EDUCATIONAL ABSTRACTION');
      expect(html).toContain('LIVE TOY COMPUTATION');
      expect(html).toContain('BDH is not a Mamba-style SSM');
      expect(html).toContain('Both involve state that changes during inference, but the implementations and mathematical structures are different.');
      expect(html).toContain('Dynamic Synaptic State');
      expect(html).toContain('Learned Network Parameters');
      expect(html).toContain('CHANGES');
      expect(html).toContain('REMAINS FIXED');
      expect(html).toContain('The BDH-CQ Bridge: Recurrent Inference-Time Latent Reasoning');
      expect(html).toContain('arXiv:2509.26507');
      expect(html).toContain('arXiv:2608.09888');
    });
  });

  describe('Sources & Limitations', () => {
    it('renders primary literature with direct links and verified titles', () => {
      const element = React.createElement(Sources);
      const html = renderToString(element);

      expect(html).toContain('Primary Sources &amp; Research Foundation');
      expect(html).toContain('The Dragon Hatchling');
      expect(html).toContain('BDH-CQ');
      expect(html).toContain('Retentive Network');
      expect(html).toContain('Gated Linear Attention');
      expect(html).toContain('Delta Rule');
      expect(html).toContain('https://arxiv.org/abs/2509.26507');
      expect(html).toContain('https://arxiv.org/abs/2608.09888');
    });

    it('renders limitations and honest labels', () => {
      const element = React.createElement(Limitations);
      const html = renderToString(element);

      expect(html).toContain('Limitations &amp; Honest Labels');
      expect(html).toContain('EDUCATIONAL TOY MODEL');
      expect(html).toContain('SCIENTIFIC BOUNDARIES');
      expect(html).toContain('This experiment does not claim N ≤ d guarantees perfect retrieval');
      expect(html).toContain('PROVENANCE');
    });
  });

  describe('ScenarioMode', () => {
    it('renders ScenarioMode with memory health report, scenarios, and recommendation', () => {
      const element = React.createElement(ScenarioMode);
      const html = renderToString(element);

      expect(html).toContain('Stress-Test Bounded AI Memory Before You Ship It');
      expect(html).toContain('AI Agent Memory');
      expect(html).toContain('Customer Support Context');
      expect(html).toContain('IoT Device &amp; Sensor Stream');
      expect(html).toContain('Toy-Model Memory Indicator &amp; Retrieval Diagnostic');
      expect(html).toContain('Toy-Model Diagnostic &amp; Suggested Experiment');
      expect(html).toContain('Retrieval &amp; Cross-Talk Diagnosis');
      expect(html).toContain('All Injected Associations');
      expect(html).toContain('These diagnostics describe the specified toy associative-memory system');
    });
  });
});
