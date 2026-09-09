'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  runExperiment,
  runErrorVsNSweep,
  type ExperimentConfig,
  type ExperimentResult,
  type SweepPoint,
} from '@/lib/experiments';
import type { UpdateRule } from '@/lib/associativeMemory';

/** The four demonstration presets. */
export interface Preset {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  description: string;
  d: number;
  N: number;
  rho: number;
  rule: UpdateRule;
}

export const PRESETS: Preset[] = [
  {
    id: 'A',
    label: 'Clean Memory',
    description: 'Low load, low overlap — accurate retrieval expected',
    d: 16,
    N: 4,
    rho: 0,
    rule: 'hebbian',
  },
  {
    id: 'B',
    label: 'Memory Pressure',
    description: 'Many associations forced into a small state',
    d: 8,
    N: 24,
    rho: 0.3,
    rule: 'hebbian',
  },
  {
    id: 'C',
    label: 'High Overlap',
    description: 'Similar keys increase cross-talk interference',
    d: 8,
    N: 12,
    rho: 0.8,
    rule: 'hebbian',
  },
  {
    id: 'D',
    label: 'Update Rules',
    description: 'Compare Hebbian vs Delta update on identical data',
    d: 8,
    N: 16,
    rho: 0.3,
    rule: 'delta',
  },
];

/** All state managed by the experiment hook. */
export interface ExperimentState {
  // Controls
  seed: number;
  d: number;
  N: number;
  rho: number;
  rule: UpdateRule;
  selectedQueryIndex: number;
  activePreset: string | null;

  // Results
  result: ExperimentResult;
  sweepData: SweepPoint[];

  // Comparison: always runs the other rule with the same seed/d/N/rho
  comparisonResult: ExperimentResult | null;

  // Actions
  setD: (d: number) => void;
  setN: (N: number) => void;
  setRho: (rho: number) => void;
  setRule: (rule: UpdateRule) => void;
  setSelectedQueryIndex: (idx: number) => void;
  setSeed: (seed: number) => void;
  applyPreset: (preset: Preset) => void;
}

const DEFAULT_SEED = 42;
const SWEEP_MAX_N = 64;

export function useExperiment(): ExperimentState {
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [d, setDState] = useState(16);
  const [N, setNState] = useState(4);
  const [rho, setRhoState] = useState(0);
  const [rule, setRuleState] = useState<UpdateRule>('hebbian');
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);
  const [activePreset, setActivePreset] = useState<string | null>('A');

  // Clamp selectedQueryIndex when N changes
  const clampedQueryIndex = Math.min(selectedQueryIndex, Math.max(0, N - 1));

  // Primary experiment — recomputes whenever controls change
  const result = useMemo(() => {
    const config: ExperimentConfig = {
      seed,
      d,
      N,
      rho,
      rule,
      selectedQueryIndex: clampedQueryIndex,
    };
    return runExperiment(config);
  }, [seed, d, N, rho, rule, clampedQueryIndex]);

  // Comparison experiment — runs the OTHER rule with identical seed/d/N/rho
  // This guarantees the same keys and values, enabling fair comparison
  const comparisonResult = useMemo(() => {
    const otherRule: UpdateRule = rule === 'hebbian' ? 'delta' : 'hebbian';
    const config: ExperimentConfig = {
      seed,
      d,
      N,
      rho,
      rule: otherRule,
      selectedQueryIndex: clampedQueryIndex,
    };
    return runExperiment(config);
  }, [seed, d, N, rho, rule, clampedQueryIndex]);

  // Error-vs-N sweep — recomputes with current d/rho/rule
  const sweepData = useMemo(() => {
    return runErrorVsNSweep(seed, d, rho, rule, SWEEP_MAX_N);
  }, [seed, d, rho, rule]);

  // Setters that clear the active preset when manually adjusted
  const setD = useCallback((val: number) => {
    setDState(val);
    setActivePreset(null);
    setSelectedQueryIndex(0);
  }, []);

  const setN = useCallback((val: number) => {
    setNState(val);
    setActivePreset(null);
  }, []);

  const setRho = useCallback((val: number) => {
    setRhoState(val);
    setActivePreset(null);
  }, []);

  const setRule = useCallback((val: UpdateRule) => {
    setRuleState(val);
    setActivePreset(null);
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    setDState(preset.d);
    setNState(preset.N);
    setRhoState(preset.rho);
    setRuleState(preset.rule);
    setActivePreset(preset.id);
    setSelectedQueryIndex(0);
  }, []);

  return {
    seed,
    d,
    N,
    rho,
    rule,
    selectedQueryIndex: clampedQueryIndex,
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
  };
}
