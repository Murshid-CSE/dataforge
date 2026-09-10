'use client';

import React from 'react';
import type { UpdateRule } from '@/lib/associativeMemory';

export interface ControlPanelProps {
  d: number;
  N: number;
  rho: number;
  rule: UpdateRule;
  seed: number;
  measuredPairwiseCosine?: number;
  onDChange: (d: number) => void;
  onNChange: (N: number) => void;
  onRhoChange: (rho: number) => void;
  onRuleChange: (rule: UpdateRule) => void;
  onSeedChange: (seed: number) => void;
  className?: string;
}

/**
 * ControlPanel component.
 * Allows interactive adjustment of experiment parameters:
 * - State dimension d (select: 4, 8, 16, 32)
 * - Associations N (slider: 1-64)
 * - Key overlap rho (slider: 0-0.9) with clear expected vs measured semantics
 * - Update rule (toggle: Hebbian vs Delta) with fair comparison notice
 * - Seed (numeric input for reproducibility)
 */
export function ControlPanel({
  d,
  N,
  rho,
  rule,
  seed,
  measuredPairwiseCosine,
  onDChange,
  onNChange,
  onRhoChange,
  onRuleChange,
  onSeedChange,
  className = '',
}: ControlPanelProps) {
  const capacityRatio = N / d;
  const isOverloaded = capacityRatio > 1.0;

  return (
    <div className={`glass-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-lg ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. State dimension d */}
        <div className="flex flex-col justify-between space-y-3 bg-surface-2/60 p-4 rounded-xl border border-border/70 hover:border-accent/40 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="dim-select" className="text-sm text-muted block">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <span>📏</span> State dimension (d)
                </span>
              </label>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface border border-border text-accent font-semibold">
                {d}×{d}
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-snug">
              Size of the bounded associative state
            </p>
          </div>
          <div className="mt-auto pt-2 space-y-1.5">
            <select
              id="dim-select"
              value={d}
              onChange={(e) => onDChange(Number(e.target.value))}
              aria-label="State dimension (d)"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition shadow-sm"
            >
              <option value={4}>4 (Tiny state · 16 values)</option>
              <option value={8}>8 (Standard toy · 64 values)</option>
              <option value={16}>16 (Clean capacity · 256 values)</option>
              <option value={32}>32 (Wide capacity · 1024 values)</option>
            </select>
            <div className="text-[11px] font-mono text-muted flex items-center justify-between">
              <span>Chalkboard size:</span>
              <span className="text-foreground font-semibold">{d * d} floats</span>
            </div>
          </div>
        </div>

        {/* 2. Associations N */}
        <div className="flex flex-col justify-between space-y-3 bg-surface-2/60 p-4 rounded-xl border border-border/70 hover:border-accent/40 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="n-slider" className="text-sm text-muted">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <span>📝</span> Associations (N)
                </span>
              </label>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface border border-border text-foreground font-semibold">
                N = {N}
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-snug">
              How much information we force into that state
            </p>
          </div>
          <div className="mt-auto pt-2 space-y-1.5">
            <input
              id="n-slider"
              type="range"
              min={1}
              max={64}
              step={1}
              value={N}
              onChange={(e) => onNChange(Number(e.target.value))}
              aria-label="Associations (N)"
              className="w-full accent-accent cursor-pointer bg-surface h-2 rounded-lg"
            />
            {/* Real-time memory pressure meter */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted">Load ratio (N/d):</span>
              <span
                className={`font-semibold px-1.5 py-0.2 rounded text-[10px] ${
                  isOverloaded
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {capacityRatio.toFixed(1)}x {isOverloaded ? '⚠️ Pressure' : '🟢 Safe'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Key overlap rho */}
        <div className="flex flex-col justify-between space-y-3 bg-surface-2/60 p-4 rounded-xl border border-border/70 hover:border-accent/40 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="rho-slider" className="text-sm text-muted">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <span>🌫️</span> Key overlap (ρ)
                </span>
              </label>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface border border-border text-foreground font-semibold">
                ρ = {rho.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-snug">
              ρ controls the expected similarity of generated key vectors. Actual pairwise cosine similarity is measured from the generated keys.
            </p>
          </div>
          <div className="mt-auto pt-2 space-y-1.5">
            <input
              id="rho-slider"
              type="range"
              min={0}
              max={0.9}
              step={0.05}
              value={rho}
              onChange={(e) => onRhoChange(Number(e.target.value))}
              aria-label="Key overlap (ρ)"
              className="w-full accent-accent cursor-pointer bg-surface h-2 rounded-lg"
            />
            {measuredPairwiseCosine !== undefined && (
              <div className="text-[11px] font-mono text-muted flex items-center justify-between">
                <span>Configured ρ: <strong className="text-foreground">{rho.toFixed(2)}</strong></span>
                <span>Measured mean: <strong className="text-accent">{measuredPairwiseCosine.toFixed(3)}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Update rule */}
        <div className="flex flex-col justify-between space-y-3 bg-surface-2/60 p-4 rounded-xl border border-border/70 hover:border-accent/40 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted block">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <span>✏️</span> Update rule
                </span>
              </span>
              <span className="text-[10px] font-mono text-muted uppercase">
                Same data; different rule
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-snug">
              How each new association changes memory
            </p>
          </div>
          <div className="mt-auto pt-2 flex gap-2" role="group" aria-label="Update rule">
            <button
              type="button"
              onClick={() => onRuleChange('hebbian')}
              aria-pressed={rule === 'hebbian'}
              aria-label="Hebbian update rule"
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition flex flex-col items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                rule === 'hebbian'
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-surface text-muted hover:text-foreground hover:bg-surface-2 border border-border'
              }`}
            >
              <span>Hebbian</span>
              <span className="text-[9px] font-normal opacity-80">Additive</span>
            </button>
            <button
              type="button"
              onClick={() => onRuleChange('delta')}
              aria-pressed={rule === 'delta'}
              aria-label="Delta update rule"
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition flex flex-col items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                rule === 'delta'
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-surface text-muted hover:text-foreground hover:bg-surface-2 border border-border'
              }`}
            >
              <span>Delta</span>
              <span className="text-[9px] font-normal opacity-80">Corrective</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reproducibility footer */}
      <div className="mt-4 pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
        <span className="text-[11px]">
          Deterministic execution: identical parameters and seed reproduce identical numerical results.
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="seed-input" className="text-muted">
            <span className="text-foreground font-medium">PRNG Seed:</span>
          </label>
          <input
            id="seed-input"
            type="number"
            value={seed}
            onChange={(e) => onSeedChange(Number(e.target.value) || 0)}
            aria-label="PRNG Seed"
            className="w-20 bg-surface-2 border border-border rounded px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
