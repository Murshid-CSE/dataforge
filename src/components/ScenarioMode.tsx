'use client';

import React, { useState, useMemo } from 'react';
import {
  SCENARIOS,
  evaluateScenario,
  type ScenarioDefinition,
} from '@/lib/scenarios';
import type { UpdateRule } from '@/lib/associativeMemory';

export interface ScenarioModeProps {
  className?: string;
}

export function ScenarioMode({ className = '' }: ScenarioModeProps) {
  const scenarioKeys = useMemo(() => Object.keys(SCENARIOS), []);

  const [scenarioId, setScenarioId] = useState<string>('ai-agent');
  const activeScenario: ScenarioDefinition = SCENARIOS[scenarioId] ?? SCENARIOS['ai-agent'];

  const [d, setD] = useState<number>(activeScenario.defaultD);
  const [N, setN] = useState<number>(activeScenario.defaultN);
  const [rho, setRho] = useState<number>(activeScenario.defaultRho);
  const [rule, setRule] = useState<UpdateRule>(activeScenario.defaultRule);
  const [seed, setSeed] = useState<number>(42);

  const [selectedFactIndex, setSelectedFactIndex] = useState<number>(0);

  // Evaluate the scenario deterministically
  const evaluation = useMemo(() => {
    return evaluateScenario(scenarioId, d, N, rho, rule, seed);
  }, [scenarioId, d, N, rho, rule, seed]);

  const activeFactResult =
    evaluation.factResults[selectedFactIndex] ?? evaluation.factResults[0];

  // Handler to switch scenarios and reset defaults
  const handleScenarioSelect = (id: string) => {
    setScenarioId(id);
    const target = SCENARIOS[id];
    if (target) {
      setD(target.defaultD);
      setN(target.defaultN);
      setRho(target.defaultRho);
      setRule(target.defaultRule);
      setSelectedFactIndex(0);
    }
  };

  // Handler for one-click recommendation fixes
  const handleApplyRecommendation = () => {
    if (evaluation.recommendation.suggestedAction === 'increase_d') {
      setD((prev) => (prev < 16 ? 16 : 32));
    } else if (evaluation.recommendation.suggestedAction === 'use_delta') {
      setRule('delta');
    } else if (evaluation.recommendation.suggestedAction === 'reduce_rho') {
      setRho((prev) => Math.max(0.05, Number((prev - 0.2).toFixed(2))));
    }
  };

  const getRiskColor = (risk: 'safe' | 'degraded' | 'corrupted') => {
    switch (risk) {
      case 'safe':
        return 'text-success border-success/30 bg-success/10';
      case 'degraded':
        return 'text-warning border-warning/30 bg-warning/10';
      case 'corrupted':
        return 'text-danger border-danger/30 bg-danger/10';
    }
  };

  const getHealthBadgeColor = (score: number) => {
    if (score >= 80) return 'text-success border-success/30 bg-success/10';
    if (score >= 60) return 'text-warning border-warning/30 bg-warning/10';
    return 'text-danger border-danger/30 bg-danger/10';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Header Banner & Scenario Selector */}
      <section className="bg-surface rounded-lg border border-border p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                Interactive Scenario Lab
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/15 text-accent border border-accent/30 font-semibold">
                MODE 2: STRESS TEST
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1 tracking-tight">
              Stress-Test Bounded AI Memory Before You Ship It
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Select a realistic streaming scenario, enforce memory constraints, and observe which facts maintain high retrieval fidelity vs. cross-talk distortion.
            </p>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {scenarioKeys.map((key) => {
            const sc = SCENARIOS[key];
            const isActive = sc.id === scenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => handleScenarioSelect(sc.id)}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  isActive
                    ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent/30'
                    : 'border-border bg-surface-2 hover:border-border-focus'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                    {sc.domain}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  )}
                </div>
                <div className="text-sm font-semibold text-foreground mt-1">
                  {sc.name}
                </div>
                <div className="text-[11px] text-muted mt-1 line-clamp-2 leading-relaxed">
                  {sc.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Interactive Constraint Controls & Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory Constraints Controls */}
        <section className="bg-surface rounded-lg border border-border p-5 space-y-4 lg:col-span-1">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">
              Memory Constraints
            </h3>
            <p className="text-xs text-muted">
              Configure bounded state capacity and correlation
            </p>
          </div>

          {/* State Dimension d */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">State Dimension (d)</span>
              <span className="font-mono text-accent">{d} × {d} ({d * d} slots)</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[4, 8, 16, 32].map((dim) => (
                <button
                  key={dim}
                  onClick={() => setD(dim)}
                  className={`py-1 text-xs font-mono rounded border transition-colors ${
                    d === dim
                      ? 'bg-accent text-white border-accent font-semibold'
                      : 'bg-surface-2 text-foreground border-border hover:border-border-focus'
                  }`}
                >
                  d={dim}
                </button>
              ))}
            </div>
          </div>

          {/* Injected Facts N */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Stored Facts (N)</span>
              <span className="font-mono text-accent">{N} / {activeScenario.facts.length}</span>
            </div>
            <input
              type="range"
              min={4}
              max={activeScenario.facts.length}
              step={1}
              value={N}
              onChange={(e) => setN(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
          </div>

          {/* Key Overlap / Correlation rho */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Cue Overlap (ρ)</span>
              <span className="font-mono text-accent">{rho.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.9}
              step={0.05}
              value={rho}
              onChange={(e) => setRho(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted">
              <span>0.00 (Orthogonal)</span>
              <span>0.90 (Collinear)</span>
            </div>
          </div>

          {/* Update Rule */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Update Strategy</span>
              <span className="font-mono text-xs uppercase text-muted">{rule}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRule('hebbian')}
                className={`py-1.5 px-3 rounded text-xs font-medium border transition-colors ${
                  rule === 'hebbian'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface-2 text-foreground border-border hover:border-border-focus'
                }`}
              >
                Hebbian (Additive)
              </button>
              <button
                onClick={() => setRule('delta')}
                className={`py-1.5 px-3 rounded text-xs font-medium border transition-colors ${
                  rule === 'delta'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface-2 text-foreground border-border hover:border-border-focus'
                }`}
              >
                Delta (Targeted)
              </button>
            </div>
          </div>

          {/* Seed */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted">Seed</span>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              className="w-20 px-2 py-0.5 rounded bg-surface-2 border border-border font-mono text-xs text-foreground"
            />
          </div>
        </section>

        {/* Toy-Model Memory Indicator & Retrieval Diagnostic */}
        <section className="bg-surface rounded-lg border border-border p-5 space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <h3 className="text-sm font-semibold text-foreground">
                  Toy-Model Memory Indicator &amp; Retrieval Diagnostic
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono border font-semibold ${getHealthBadgeColor(evaluation.healthScore)}`}>
                  Toy-Model Memory Indicator: {evaluation.healthScore}%
                </span>
              </div>
            </div>
            <div className="text-[10px] text-muted font-mono mt-1">
              Composite indicator for this educational scenario; weighting is a product-design heuristic, not a validated production memory-quality metric.
            </div>

            {/* Top Score Cards: Retrieval Cosine is the Hero Metric */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-surface-2 rounded-md border border-border p-3">
                <div className="text-[10px] font-mono uppercase text-muted">Mean Retrieval Cosine</div>
                <div className="text-lg font-bold font-mono text-accent mt-0.5">
                  {evaluation.experimentResult.aggregate.meanCosine.toFixed(3)}
                </div>
                <div className="text-[10px] text-muted mt-0.5">Primary retrieval metric</div>
              </div>

              <div className="bg-surface-2 rounded-md border border-border p-3">
                <div className="text-[10px] font-mono uppercase text-muted">High Fidelity</div>
                <div className="text-lg font-bold font-mono text-success mt-0.5">
                  {evaluation.safeCount} / {N}
                </div>
                <div className="text-[10px] text-muted mt-0.5">Cosine ≥ 0.82</div>
              </div>

              <div className="bg-surface-2 rounded-md border border-border p-3">
                <div className="text-[10px] font-mono uppercase text-muted">High Distortion</div>
                <div className="text-lg font-bold font-mono text-danger mt-0.5">
                  {evaluation.highRiskCount} / {N}
                </div>
                <div className="text-[10px] text-muted mt-0.5">Cosine &lt; 0.60</div>
              </div>

              <div className="bg-surface-2 rounded-md border border-border p-3">
                <div className="text-[10px] font-mono uppercase text-muted">Measured Overlap</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                  {evaluation.measuredKeyOverlap.toFixed(3)}
                </div>
                <div className="text-[10px] text-muted mt-0.5">Mean pairwise cosine</div>
              </div>
            </div>

            {/* Toy-Model Diagnostic Box */}
            <div className="mt-4 p-4 rounded-lg bg-surface-2 border border-border space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Toy-Model Diagnostic &amp; Suggested Experiment
                </span>
                {evaluation.recommendation.suggestedAction && (
                  <button
                    onClick={handleApplyRecommendation}
                    className="px-2.5 py-1 rounded bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors shadow-sm"
                  >
                    ⚡ Try Suggested Configuration
                  </button>
                )}
              </div>
              <div className="text-sm font-semibold text-foreground">
                {evaluation.recommendation.headline}
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {evaluation.recommendation.details}
              </p>
            </div>
          </div>

          {/* Explicit Scenario Disclaimer */}
          <div className="text-[11px] text-muted border-t border-border pt-3">
            <strong>Honest Scientific Boundary:</strong> These diagnostics describe the specified toy associative-memory system. They are useful for exploring memory-design trade-offs, but they are not a production-model safety or performance guarantee.
          </div>
        </section>
      </div>

      {/* 3. Interactive Query Inspector & Cross-Talk Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Selector & Decoded Comparison */}
        <section className="bg-surface rounded-lg border border-border p-5 space-y-4 lg:col-span-2">
          <div className="border-b border-border pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Retrieval &amp; Cross-Talk Diagnosis
              </h3>
              <p className="text-xs text-muted">
                Inspect retrieval accuracy and pinpoint interfering memories
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Query:</span>
              <select
                value={selectedFactIndex}
                onChange={(e) => setSelectedFactIndex(Number(e.target.value))}
                className="bg-surface-2 border border-border rounded px-2 py-1 text-xs font-mono text-foreground"
              >
                {evaluation.factResults.map((fr) => (
                  <option key={fr.factIndex} value={fr.factIndex}>
                    #{fr.factIndex + 1}: {fr.fact.key}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Suggested Quick Query Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
              Quick Query Prompts
            </span>
            <div className="flex flex-wrap gap-2">
              {activeScenario.queries.slice(0, 4).map((q) => {
                const targetIdx = evaluation.factResults.findIndex(
                  (f) => f.fact.key === q.factKey
                );
                if (targetIdx === -1) return null;
                const isSelected = selectedFactIndex === targetIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedFactIndex(targetIdx)}
                    className={`px-2.5 py-1 rounded text-xs border transition-colors ${
                      isSelected
                        ? 'bg-accent text-white border-accent'
                        : 'bg-surface-2 text-muted hover:text-foreground border-border'
                    }`}
                  >
                    &ldquo;{q.prompt}&rdquo;
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Fact Retrieval Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Ground Truth */}
            <div className="p-4 rounded-lg bg-surface-2 border border-border space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-ground-truth font-semibold">
                Ground Truth Stored Fact
              </div>
              <div className="space-y-1 font-mono text-xs">
                <div>
                  <span className="text-muted">Key: </span>
                  <span className="text-foreground font-semibold">
                    {activeFactResult.fact.key}
                  </span>
                </div>
                <div>
                  <span className="text-muted">Value: </span>
                  <span className="text-ground-truth font-bold">
                    {activeFactResult.fact.value}
                  </span>
                </div>
                <div>
                  <span className="text-muted">Category: </span>
                  <span className="text-muted">{activeFactResult.fact.category}</span>
                </div>
              </div>
            </div>

            {/* Model Retrieved Output */}
            <div className="p-4 rounded-lg bg-surface-2 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-retrieved font-semibold">
                  Compressed Memory Retrieval
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${getRiskColor(
                    activeFactResult.risk
                  )}`}
                >
                  {activeFactResult.statusLabel}
                </span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                <div>
                  <span className="text-muted">Cosine: </span>
                  <span
                    className={`font-bold ${
                      activeFactResult.cosine >= 0.82
                        ? 'text-success'
                        : activeFactResult.cosine >= 0.6
                        ? 'text-warning'
                        : 'text-danger'
                    }`}
                  >
                    {activeFactResult.cosine.toFixed(3)}
                  </span>
                  <span className="text-muted ml-2">MSE: {activeFactResult.mse.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-muted">Decoded State: </span>
                  <span className="text-retrieved font-semibold break-all">
                    {activeFactResult.decodedValue}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Talk Leaked Memories Breakdown */}
          <div className="p-4 rounded-lg bg-surface-2/60 border border-border space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cross-talk font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cross-talk" />
              Why Did Retrieval Differ? (Interference Breakdown)
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              When querying key <code className="text-accent">{activeFactResult.fact.key}</code>, non-zero dot products with other stored keys inject their values as cross-talk:
            </p>

            {activeFactResult.topInterferingFacts.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                {activeFactResult.topInterferingFacts.map((inf, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs font-mono bg-surface p-2 rounded border border-border"
                  >
                    <div>
                      <span className="text-muted">Leaked from </span>
                      <span className="text-cross-talk font-medium">#{inf.factKey}</span>
                      <span className="text-muted text-[11px] ml-1">({inf.factValue})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted text-[10px]">Overlap: </span>
                      <span
                        className={`font-semibold ${
                          Math.abs(inf.overlap) > 0.3 ? 'text-cross-talk' : 'text-muted'
                        }`}
                      >
                        {inf.overlap.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted italic">
                No cross-talk detected (single association or completely orthogonal keys).
              </div>
            )}
          </div>
        </section>

        {/* Highest Retrieval Distortion */}
        <section className="bg-surface rounded-lg border border-border p-5 space-y-4 lg:col-span-1">
          <div className="border-b border-border pb-2">
            <h3 className="text-sm font-semibold text-foreground">
              Highest Retrieval Distortion
            </h3>
            <p className="text-xs text-muted">
              Associations with lowest directional cosine similarity
            </p>
          </div>

          <div className="space-y-2">
            {evaluation.mostVulnerable.map((vuln, i) => (
              <div
                key={vuln.factIndex}
                onClick={() => setSelectedFactIndex(vuln.factIndex)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedFactIndex === vuln.factIndex
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-surface-2 hover:border-border-focus'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted">#{i + 1} Lowest Cosine</span>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      vuln.cosine < 0.6 ? 'text-danger' : 'text-warning'
                    }`}
                  >
                    cos: {vuln.cosine.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs font-semibold text-foreground mt-1">
                  {vuln.fact.key}
                </div>
                <div className="text-[11px] text-muted truncate">
                  Value: {vuln.fact.value}
                </div>
                {vuln.topInterferingFacts[0] && (
                  <div className="text-[10px] text-cross-talk mt-1">
                    Interfered by: {vuln.topInterferingFacts[0].factKey}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-muted">
              Click any card to inspect cross-talk decomposition
            </span>
          </div>
        </section>
      </div>

      {/* 4. Complete Injected Facts Inventory */}
      <section className="bg-surface rounded-lg border border-border p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              All Injected Associations ({evaluation.factResults.length} Facts)
            </h3>
            <p className="text-xs text-muted">
              Complete inventory of structured facts compressed into state M
            </p>
          </div>
          <span className="text-xs font-mono text-muted">
            State: {d}×{d} Matrix ({d * d} floats)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface-2 border-b border-border">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Key</th>
                <th className="py-2 px-3">Ground Truth Value</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Cosine</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {evaluation.factResults.map((fr) => {
                const isSelected = selectedFactIndex === fr.factIndex;
                return (
                  <tr
                    key={fr.factIndex}
                    className={`hover:bg-surface-2 transition-colors ${
                      isSelected ? 'bg-accent/10' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-mono text-muted">
                      {fr.factIndex + 1}
                    </td>
                    <td className="py-2 px-3 font-mono font-medium text-foreground">
                      {fr.fact.key}
                    </td>
                    <td className="py-2 px-3 font-medium text-foreground/90">
                      {fr.fact.value}
                    </td>
                    <td className="py-2 px-3 text-muted">{fr.fact.category}</td>
                    <td className="py-2 px-3 font-mono">
                      <span
                        className={
                          fr.cosine >= 0.82
                            ? 'text-success'
                            : fr.cosine >= 0.6
                            ? 'text-warning'
                            : 'text-danger'
                        }
                      >
                        {fr.cosine.toFixed(3)}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border ${getRiskColor(
                          fr.risk
                        )}`}
                      >
                        {fr.risk}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => setSelectedFactIndex(fr.factIndex)}
                        className="text-xs font-mono text-accent hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ScenarioMode;
