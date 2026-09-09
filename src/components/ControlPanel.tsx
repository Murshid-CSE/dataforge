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
  return (
    <div className={`bg-surface rounded-lg border border-border p-4 sm:p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. State dimension d */}
        <div className="flex flex-col justify-between space-y-2 bg-surface-2/40 p-3 rounded-lg border border-border/50">
          <div>
            <label htmlFor="dim-select" className="text-sm text-muted block">
              <span className="text-foreground font-medium">State dimension (d)</span>
            </label>
            <p className="text-xs text-muted mt-0.5">
              Size of the bounded associative state
            </p>
          </div>
          <div className="mt-auto pt-1">
            <select
              id="dim-select"
              value={d}
              onChange={(e) => onDChange(Number(e.target.value))}
              aria-label="State dimension (d)"
              className="w-full bg-surface-2 border border-border rounded-md px-3 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              <option value={4}>4 (Tiny state)</option>
              <option value={8}>8 (Standard toy)</option>
              <option value={16}>16 (Clean capacity)</option>
              <option value={32}>32 (Wide capacity)</option>
            </select>
          </div>
        </div>

        {/* 2. Associations N */}
        <div className="flex flex-col justify-between space-y-2 bg-surface-2/40 p-3 rounded-lg border border-border/50">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="n-slider" className="text-sm text-muted">
                <span className="text-foreground font-medium">Associations (N)</span>
              </label>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-2 border border-border text-foreground font-semibold">
                N = {N}
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              How much information we force into that state
            </p>
          </div>
          <div className="mt-auto pt-1">
            <input
              id="n-slider"
              type="range"
              min={1}
              max={64}
              step={1}
              value={N}
              onChange={(e) => onNChange(Number(e.target.value))}
              aria-label="Associations (N)"
              className="w-full accent-accent cursor-pointer bg-surface-2 h-2 rounded-lg"
            />
          </div>
        </div>

        {/* 3. Key overlap rho */}
        <div className="flex flex-col justify-between space-y-2 bg-surface-2/40 p-3 rounded-lg border border-border/50">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="rho-slider" className="text-sm text-muted">
                <span className="text-foreground font-medium">Key overlap (ρ)</span>
              </label>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-2 border border-border text-foreground font-semibold">
                ρ = {rho.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5 leading-snug">
              ρ controls the expected similarity of generated key vectors. Actual pairwise cosine similarity is measured from the generated keys.
            </p>
          </div>
          <div className="mt-auto pt-1 space-y-1.5">
            <input
              id="rho-slider"
              type="range"
              min={0}
              max={0.9}
              step={0.05}
              value={rho}
              onChange={(e) => onRhoChange(Number(e.target.value))}
              aria-label="Key overlap (ρ)"
              className="w-full accent-accent cursor-pointer bg-surface-2 h-2 rounded-lg"
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
        <div className="flex flex-col justify-between space-y-2 bg-surface-2/40 p-3 rounded-lg border border-border/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted block">
                <span className="text-foreground font-medium">Update rule</span>
              </span>
              <span className="text-[10px] font-mono text-muted uppercase">
                Same data; different rule
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              How each new association changes memory
            </p>
          </div>
          <div className="mt-auto pt-1 flex gap-2" role="group" aria-label="Update rule">
            <button
              type="button"
              onClick={() => onRuleChange('hebbian')}
              aria-pressed={rule === 'hebbian'}
              aria-label="Hebbian update rule"
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                rule === 'hebbian'
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-2 text-muted hover:text-foreground hover:bg-border border border-border'
              }`}
            >
              Hebbian
            </button>
            <button
              type="button"
              onClick={() => onRuleChange('delta')}
              aria-pressed={rule === 'delta'}
              aria-label="Delta update rule"
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                rule === 'delta'
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-2 text-muted hover:text-foreground hover:bg-border border border-border'
              }`}
            >
              Delta
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
