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

export type LabTab = 'playground' | 'scenarios' | 'math' | 'bdh' | 'sources';

export default function Home() {
  const [activeTab, setActiveTab] = useState<LabTab>('playground');
  const [activeMode, setActiveMode] = useState<'explore' | 'stress-test'>('explore');
  const [viewMode, setViewMode] = useState<'story' | 'expert'>('story');
  const [unifiedView, setUnifiedView] = useState<boolean>(false);

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
    setActiveTab('playground');
  };

  const handleTabSelect = (tab: string) => {
    const nextTab = tab as LabTab;
    setActiveTab(nextTab);
    if (nextTab === 'scenarios') {
      setActiveMode('stress-test');
    } else {
      setActiveMode('explore');
    }
  };

  // Memory clarity percentage
  const liveClarity = currentQueryDetail
    ? Math.max(0, Math.min(100, Math.round(currentQueryDetail.cosine * 1000) / 10))
    : 100;

  return (
    <main className="min-h-screen bg-background text-foreground py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* 1. Header with Tab Navigation, Metaphor Banner, and Mode Switchers */}
        <ClaimHeader
          activeMode={activeMode}
          onModeChange={setActiveMode}
          activeTab={activeTab}
          onTabChange={handleTabSelect}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* 2. Floating Quick Status & Metrics HUD */}
        <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-border/80 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-muted font-medium">Chalkboard:</span>
              <span className="font-mono font-bold text-foreground bg-surface px-2 py-0.5 rounded border border-border">
                {d}&times;{d} ({d * d} floats)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted font-medium">Associations:</span>
              <span className="font-mono font-bold text-foreground bg-surface px-2 py-0.5 rounded border border-border">
                N = {N}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted font-medium">Key Overlap:</span>
              <span className="font-mono font-bold text-accent bg-surface px-2 py-0.5 rounded border border-border">
                ρ = {rho.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted font-medium">Rule:</span>
              <span className="font-mono font-bold text-foreground bg-surface px-2 py-0.5 rounded border border-border uppercase text-[10px]">
                {rule}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-muted">Live Clarity:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  liveClarity >= 95
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : liveClarity >= 80
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {liveClarity.toFixed(1)}% {liveClarity >= 95 ? '💎' : liveClarity >= 80 ? '⚠️' : '🌫️'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setUnifiedView(!unifiedView)}
              className="text-[11px] font-mono text-muted hover:text-foreground bg-surface px-2.5 py-1 rounded-lg border border-border hover:border-accent transition"
            >
              {unifiedView ? '📑 Tabbed View' : '📜 Unified View'}
            </button>
          </div>
        </div>

        {/* 3. DYNAMIC TAB CONTENT */}
        {unifiedView ? (
          /* UNIFIED VIEW: All sections rendered sequentially */
          <div className="space-y-10">
            {/* Tab 1 Content */}
            <div className="space-y-6 border-b border-border/80 pb-8">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>🎮</span> Chalkboard Interactive Lab
              </h2>
              <PresetBar activePreset={activePreset} onPresetSelect={applyPreset} />
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
                    viewMode={viewMode}
                  />
                )}
              </div>
              <LearningChallenge
                onRunExperiment={handleChallengeRun}
                currentMeanCosine={result.aggregate.meanCosine}
              />
            </div>

            {/* Tab 2 Content */}
            <div className="space-y-6 border-b border-border/80 pb-8">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>⚡</span> Real-World Production Scenarios
              </h2>
              <ScenarioMode />
            </div>

            {/* Tab 3 Content */}
            <div className="space-y-6 border-b border-border/80 pb-8">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>📐</span> Mathematical Analysis &amp; Proofs
              </h2>
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
              {currentQueryDetail && (
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
              )}
              {comparisonResult && (
                <UpdateRuleComparison
                  primaryResult={result}
                  comparisonResult={comparisonResult}
                  queryIndex={selectedQueryIndex}
                />
              )}
            </div>

            {/* Tab 4 Content */}
            <div className="space-y-6 border-b border-border/80 pb-8">
              <BDHLens />
            </div>

            {/* Tab 5 Content */}
            <div className="space-y-6">
              <Sources />
              <Limitations />
            </div>
          </div>
        ) : (
          /* TABBED VIEW: Clean, Focused, Purposeful per Tab */
          <div>
            {/* TAB 1: CHALKBOARD LAB */}
            {activeTab === 'playground' && (
              <div className="space-y-6">
                {/* 1. Presets */}
                <section aria-labelledby="presets-heading" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 id="presets-heading" className="text-xs font-mono uppercase tracking-wider text-muted font-bold flex items-center gap-1.5">
                      <span>Step 1:</span> Choose a Demonstration Scenario
                    </h2>
                    <span className="text-[11px] font-mono text-muted">
                      Click any preset card to instantly load parameters
                    </span>
                  </div>
                  <PresetBar activePreset={activePreset} onPresetSelect={applyPreset} />
                </section>

                {/* 2. Controls */}
                <section aria-labelledby="controls-heading" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 id="controls-heading" className="text-xs font-mono uppercase tracking-wider text-muted font-bold flex items-center gap-1.5">
                      <span>Step 2:</span> Adjust Memory Knobs
                    </h2>
                    <span className="text-[11px] font-mono text-muted">
                      Directly alters the underlying matrix geometry
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

                {/* 3. Heatmap & Retrieval */}
                <section aria-labelledby="live-experiment-heading" className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 id="live-experiment-heading" className="text-xs font-mono uppercase tracking-wider text-muted font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span>Step 3:</span> Live Experiment &amp; Memory Inspection
                    </h2>
                    <span className="text-xs font-mono text-muted">
                      PRNG Seed: {seed} · Computed live from matrix equations
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
                        viewMode={viewMode}
                      />
                    )}
                  </div>
                </section>

                {/* 4. 60-Second Challenge */}
                <section aria-labelledby="challenge-heading">
                  <LearningChallenge
                    onRunExperiment={handleChallengeRun}
                    currentMeanCosine={result.aggregate.meanCosine}
                  />
                </section>

                {/* Call-to-action to next tab */}
                <div className="glass-card rounded-xl p-4 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-foreground/90">
                    <span className="text-base">🚀</span>
                    <span>Ready to see how bounded memory behaves in production LLM applications?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('scenarios')}
                    className="px-4 py-2 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition whitespace-nowrap"
                  >
                    Test Real Scenarios →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: REAL PRODUCTION SCENARIOS */}
            {activeTab === 'scenarios' && (
              <div className="space-y-6">
                <ScenarioMode />
                
                <div className="glass-card rounded-xl p-4 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-foreground/90">
                    <span className="text-base">📐</span>
                    <span>Want to inspect the exact KaTeX formulas and algebraic cross-talk proofs?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('math')}
                    className="px-4 py-2 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition whitespace-nowrap"
                  >
                    Explore Deep Math →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: DEEP MATH & PROOFS */}
            {activeTab === 'math' && (
              <div className="space-y-6">
                {/* Dynamic Sweep Chart & Cross-Talk Decomposition */}
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

                {/* Exact KV Reference Comparison */}
                {currentQueryDetail && (
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
                )}

                {/* Update Rule Comparison */}
                {comparisonResult && (
                  <UpdateRuleComparison
                    primaryResult={result}
                    comparisonResult={comparisonResult}
                    queryIndex={selectedQueryIndex}
                  />
                )}

                <div className="glass-card rounded-xl p-4 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-foreground/90">
                    <span className="text-base">🧠</span>
                    <span>Learn how fast weights relate to biological synapses in the BDH architecture:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('bdh')}
                    className="px-4 py-2 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition whitespace-nowrap"
                  >
                    View BDH Brain Lens →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: BDH BRAIN LENS */}
            {activeTab === 'bdh' && (
              <div className="space-y-6">
                <BDHLens />

                <div className="glass-card rounded-xl p-4 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-foreground/90">
                    <span className="text-base">📚</span>
                    <span>Review verified primary literature and scientific boundaries:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('sources')}
                    className="px-4 py-2 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition whitespace-nowrap"
                  >
                    View Verified Sources &amp; Limitations →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: RESEARCH & PAPERS */}
            {activeTab === 'sources' && (
              <div className="space-y-6">
                <Sources />
                <Limitations />
              </div>
            )}
          </div>
        )}

        {/* Global Footer with Provenance & Citation Note */}
        <footer className="pt-6 border-t border-border/60 text-center text-xs text-muted space-y-1">
          <p className="font-medium text-foreground/80">
            Memory Design Lab · Developed for DataForge 2026 (Pathway Track)
          </p>
          <p className="text-[11px]">
            Deterministic computation · Verified equations · Published research foundation
          </p>
        </footer>
      </div>
    </main>
  );
}

