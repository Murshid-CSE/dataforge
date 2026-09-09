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
      className={`flex flex-wrap lg:flex-nowrap gap-3 ${className}`}
    >
      {PRESETS.map((preset) => {
        const isActive = activePreset === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onPresetSelect(preset)}
            aria-pressed={isActive}
            aria-label={`Preset ${preset.id}: ${preset.label}. ${preset.description}`}
            className={`flex-1 min-w-[200px] flex flex-col items-start rounded-lg px-4 py-3 transition text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive
                ? 'bg-accent text-white shadow-sm'
                : 'bg-surface-2 text-foreground hover:bg-border border border-border'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center justify-center font-mono font-bold text-xs px-2 py-0.5 rounded ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-surface text-accent border border-border'
                }`}
              >
                {preset.id}
              </span>
              <span className="font-medium text-sm leading-tight">
                {preset.label}
              </span>
            </div>
            <p
              className={`text-xs leading-normal ${
                isActive ? 'text-white/80' : 'text-muted'
              }`}
            >
              {preset.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default PresetBar;
