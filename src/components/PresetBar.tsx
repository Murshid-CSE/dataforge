'use client';

import React from 'react';
import { PRESETS, type Preset } from '@/hooks/useExperiment';

export interface PresetBarProps {
  activePreset: string | null;
  onPresetSelect: (preset: Preset) => void;
  className?: string;
}

/**
 * PresetBar component.
 * Displays horizontal preset configuration buttons (A/B/C/D) with badges,
 * labels, and descriptive summaries.
 */
export function PresetBar({
  activePreset,
  onPresetSelect,
  className = '',
}: PresetBarProps) {
  return (
    <div
      role="group"
      aria-label="Experiment presets"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 ${className}`}
    >
      {PRESETS.map((preset) => {
        const isActive = activePreset === preset.id;
        
        // Contextual preset icons and color highlights
        const presetMeta: Record<string, { icon: string; tag: string; activeGlow: string; borderAccent: string }> = {
          A: { icon: '💎', tag: '100% Crisp', activeGlow: 'from-emerald-500/20 to-surface-2', borderAccent: 'border-emerald-500/40' },
          B: { icon: '📦', tag: 'High Pressure', activeGlow: 'from-amber-500/20 to-surface-2', borderAccent: 'border-amber-500/40' },
          C: { icon: '🌫️', tag: 'Severe Smudge', activeGlow: 'from-rose-500/20 to-surface-2', borderAccent: 'border-rose-500/40' },
          D: { icon: '✏️', tag: 'Smart Eraser', activeGlow: 'from-blue-500/20 to-surface-2', borderAccent: 'border-blue-500/40' },
        };

        const meta = presetMeta[preset.id] || { icon: '🔬', tag: 'Preset', activeGlow: 'from-accent/20 to-surface-2', borderAccent: 'border-accent/40' };

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onPresetSelect(preset)}
            aria-pressed={isActive}
            aria-label={`Preset ${preset.id}: ${preset.label}. ${preset.description}`}
            className={`group relative flex flex-col justify-between rounded-xl p-4 transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive
                ? `bg-gradient-to-br ${meta.activeGlow} border-2 border-accent text-foreground shadow-lg shadow-accent/10 scale-[1.02]`
                : 'bg-surface-2/70 hover:bg-surface-2 text-foreground border border-border/80 hover:border-border hover:shadow-sm'
            }`}
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center font-mono font-bold text-xs w-6 h-6 rounded-lg ${
                      isActive
                        ? 'bg-accent text-white shadow'
                        : 'bg-surface text-accent border border-border'
                    }`}
                  >
                    {preset.id}
                  </span>
                  <span className="text-base" aria-hidden="true">
                    {meta.icon}
                  </span>
                  <span className="font-bold text-sm tracking-tight text-foreground">
                    {preset.label}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${
                    isActive
                      ? 'bg-accent/20 text-accent border border-accent/40'
                      : 'bg-surface/80 text-muted border border-border/60'
                  }`}
                >
                  {meta.tag}
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isActive ? 'text-foreground/90 font-medium' : 'text-muted group-hover:text-foreground/80'
                }`}
              >
                {preset.description}
              </p>
            </div>

            {/* Quick parameter summary pill */}
            <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted">
              <span>d={preset.d} · N={preset.N}</span>
              <span>ρ={preset.rho} · {preset.rule}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default PresetBar;
