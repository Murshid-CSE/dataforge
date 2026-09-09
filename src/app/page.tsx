'use client';

import React, { useState } from 'react';
import { useExperiment } from '@/hooks/useExperiment';
import { ClaimHeader } from '@/components/ClaimHeader';
import { PresetBar } from '@/components/PresetBar';
import { ControlPanel } from '@/components/ControlPanel';
import { MemoryHeatmap } from '@/components/MemoryHeatmap';
import { RetrievalPanel } from '@/components/RetrievalPanel';
import ErrorChart from '@/components/ErrorChart';
import CrossTalkExplainer from '@/components/CrossTalkExplainer';
import { ExactKVComparison } from '@/components/ExactKVComparison';
import UpdateRuleComparison from '@/components/UpdateRuleComparison';
import { BDHLens } from '@/components/BDHLens';
import { LearningChallenge } from '@/components/LearningChallenge';
import { Sources } from '@/components/Sources';
import { Limitations } from '@/components/Limitations';
import { ScenarioMode } from '@/components/ScenarioMode';

export default function Home() {
  const [activeMode, setActiveMode] = useState<'explore' | 'stress-test'>('explore');

  const {
    seed,
    d,
    N,
    rho,
    rule,
    selectedQueryIndex,
    activePreset,
    result,
    sweepData,
    comparisonResult,
    setD,
    setN,
    setRho,
    setRule,
    setSelectedQueryIndex,
    setSeed,
    applyPreset,
  } = useExperiment();

  const currentQueryDetail =
    result.queryDetails[selectedQueryIndex] ?? result.queryDetails[0];

  const handleChallengeRun = (targetD: number, targetN: number, targetRho: number) => {
    setD(targetD);
    setN(targetN);
    setRho(targetRho);
    setRule('hebbian');
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Central Claim & Title Header with Mode Switcher */}
        <ClaimHeader activeMode={activeMode} onModeChange={setActiveMode} />

        {/* Conditional Mode Rendering */}
        {activeMode === 'stress-test' ? (
          /* MODE 2: Developer Scenario Stress-Test Mode */
          <ScenarioMode />
        ) : (
          /* MODE 1: Scientific Explore Mode */
          <>
            {/* 2. Interactive Presets */}
            <section aria-labelledby="presets-heading">
              <div className="flex items-center justify-between mb-2">
                <h2 id="presets-heading" className="text-xs font-mono uppercase tracking-wider text-muted">
                  Demonstration Presets
                </h2>
                <span className="text-[11px] font-mono text-muted">
                  Auto-configures experimental parameters
                </span>
              </div>
              <PresetBar activePreset={activePreset} onPresetSelect={applyPreset} />
            </section>

            {/* 3. Primary Controls */}
            <section aria-labelledby="controls-heading">
              <div className="flex items-center justify-between mb-2">
                <h2 id="controls-heading" className="text-xs font-mono uppercase tracking-wider text-muted">
                  Experiment Controls
                </h2>
                <span className="text-[11px] font-mono text-muted">
                  Directly alters underlying matrix geometry
                </span>
              </div>
              <ControlPanel
                d={d}
                N={N}
                rho={rho}
                rule={rule}
                seed={seed}
                measuredPairwiseCosine={result.measuredMeanPairwiseCosine}
                onDChange={setD}
                onNChange={setN}
                onRhoChange={setRho}
                onRuleChange={setRule}
                onSeedChange={setSeed}
              />
            </section>

            {/* 4. Live Experiment: Matrix Heatmap & Retrieval */}
            <section aria-labelledby="live-experiment-heading" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 id="live-experiment-heading" className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Live Experiment
                </h2>
                <span className="text-xs font-mono text-muted">
                  Seed: {seed} · Calculated live in browser
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <MemoryHeatmap
                  matrix={result.memoryMatrix}
                  d={d}
                  selectedQueryIndex={selectedQueryIndex}
                  onQuerySelect={setSelectedQueryIndex}
                  N={N}
                />

                {currentQueryDetail && (
                  <RetrievalPanel
                    queryIndex={selectedQueryIndex}
                    groundTruth={currentQueryDetail.groundTruth}
                    retrieved={currentQueryDetail.retrieved}
                    cosine={currentQueryDetail.cosine}
                    mse={currentQueryDetail.mse}
                    meanCosine={result.aggregate.meanCosine}
                    meanMSE={result.aggregate.meanMSE}
                    N={N}
                    measuredPairwiseCosine={result.measuredMeanPairwiseCosine}
                    onQueryChange={setSelectedQueryIndex}
                  />
                )}
              </div>
            </section>

            {/* 5. Dynamic Sweep Chart & Cross-Talk Decomposition */}
            <section aria-labelledby="analysis-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 id="analysis-heading" className="text-sm font-semibold text-foreground tracking-tight">
                  Mathematical Analysis
                </h2>
                <span className="text-xs font-mono text-muted">
                  Cross-talk breakdown &amp; capacity sweep
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <ErrorChart
                  data={sweepData}
                  currentN={N}
                  d={d}
                  rho={rho}
                  rule={rule}
                />

                <CrossTalkExplainer
                  decomposition={result.crossTalkDecomposition}
                  queryIndex={selectedQueryIndex}
                  d={d}
                  rule={rule}
                />
              </div>
            </section>

            {/* 6. Exact KV Reference Comparison */}
            {currentQueryDetail && (
              <section aria-labelledby="kv-comparison-heading">
                <ExactKVComparison
                  queryIndex={selectedQueryIndex}
                  groundTruth={currentQueryDetail.groundTruth}
                  associativeRetrieved={currentQueryDetail.retrieved}
                  exactKVRetrieved={currentQueryDetail.exactKVRetrieved}
                  associativeCosine={currentQueryDetail.cosine}
                  exactKVCosine={1.0}
                  associativeMSE={currentQueryDetail.mse}
                  exactKVMSE={0.0}
                  N={N}
                  d={d}
                />
              </section>
            )}

            {/* 7. Update Rule Comparison (Fair comparison: identical keys & values) */}
            {comparisonResult && (
              <section aria-labelledby="rule-comparison-heading">
                <UpdateRuleComparison
                  primaryResult={result}
                  comparisonResult={comparisonResult}
                  queryIndex={selectedQueryIndex}
                />
              </section>
            )}

            {/* 8. From Fast Weights to Synapses: The BDH Lens */}
            <section aria-labelledby="bdh-heading">
              <BDHLens />
            </section>

            {/* 9. 60-Second Learning Challenge */}
            <section aria-labelledby="challenge-heading">
              <LearningChallenge
                onRunExperiment={handleChallengeRun}
                currentMeanCosine={result.aggregate.meanCosine}
              />
            </section>
          </>
        )}

        {/* 10. Primary Sources (Shown in all modes) */}
        <section aria-labelledby="sources-heading">
          <Sources />
        </section>

        {/* 11. Scientific Boundaries & Provenance (Shown in all modes) */}
        <section aria-labelledby="limitations-heading">
          <Limitations />
        </section>
      </div>
    </main>
  );
}
