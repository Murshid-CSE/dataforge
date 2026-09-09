import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import BDHPlaceholder from '../src/components/BDHPlaceholder';
import LearningChallenge from '../src/components/LearningChallenge';
import Sources from '../src/components/Sources';
import Limitations from '../src/components/Limitations';

describe('BDHPlaceholder', () => {
  it('renders title, subtitle, note, progression and warning label', () => {
    const html = renderToString(<BDHPlaceholder />);
    expect(html).toContain('Next: From Fast Weights to Synapses');
    expect(html).toContain('The BDH Lens');
    expect(html).toContain(
      'This experiment studies associative memory using a simplified matrix state. The next section will connect this mechanism to the dynamic synaptic state described in Dragon Hatchling (BDH).'
    );
    expect(html).toContain('Associative memory');
    expect(html).toContain('Fast-weight intuition');
    expect(html).toContain('BDH: synaptic working memory');
    expect(html).toContain('BDH-CQ: recurrent inference-time memory');
    expect(html).toContain('Coming soon — verified against primary sources');
  });
});

describe('LearningChallenge', () => {
  it('renders in predict phase initially with setup and question', () => {
    const fn = vi.fn();
    const html = renderToString(
      <LearningChallenge onRunExperiment={fn} currentMeanCosine={0.852} />
    );
    expect(html).toContain('60-Second Learning Challenge');
    expect(html).toContain('What do you predict will happen to retrieval error when key overlap increases from ρ=0.1 to ρ=0.8?');
    expect(html).toContain('Error will increase');
    expect(html).toContain('Error will decrease');
    expect(html).toContain('Error will stay approximately unchanged');
    expect(html).toContain('0.852');
  });
});

describe('Sources', () => {
  it('renders all 5 primary sources and the bibliographic note without arXiv URLs', () => {
    const html = renderToString(<Sources />);
    expect(html).toContain('Primary Sources');
    expect(html).toContain('Dragon Hatchling / BDH');
    expect(html).toContain('Synaptic plasticity, Hebbian working memory');
    expect(html).toContain('BDH-CQ');
    expect(html).toContain('Recurrent inference-time memory');
    expect(html).toContain('RetNet');
    expect(html).toContain('Recurrence/attention connection');
    expect(html).toContain('GLA');
    expect(html).toContain('Matrix-valued recurrent memory, gating');
    expect(html).toContain('DeltaNet / Gated DeltaNet');
    expect(html).toContain('Associative recall, targeted updates');
    expect(html).toContain('Full bibliographic details will be verified against primary sources before final submission.');
    expect(html).not.toContain('arxiv.org');
  });
});

describe('Limitations', () => {
  it('renders educational toy model badge, scientific boundaries, and provenance', () => {
    const html = renderToString(<Limitations />);
    expect(html).toContain('Limitations &amp; Honest Labels');
    expect(html).toContain('EDUCATIONAL TOY MODEL');
    expect(html).toContain(
      'This simulator isolates associative-memory behavior using a simplified outer-product memory. It is not an implementation of a production language model, BDH, or any published architecture.'
    );
    expect(html).toContain('SCIENTIFIC BOUNDARIES');
    expect(html).toContain('This experiment does not claim N ≤ d guarantees perfect retrieval');
    expect(html).toContain('This experiment does not claim fixed-state memory universally forgets');
    expect(html).toContain('Sparsity does not automatically eliminate interference');
    expect(html).toContain('The Delta rule reduces but does not eliminate interference');
    expect(html).toContain('Results depend on key geometry and experimental parameters');
    expect(html).toContain('PROVENANCE');
    expect(html).toContain(
      'All numerical results shown in the interface are computed live in the browser from the stated equations. No results are hard-coded or pre-fabricated.'
    );
  });
});
