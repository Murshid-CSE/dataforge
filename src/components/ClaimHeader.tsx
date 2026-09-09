import React from 'react';

export interface ClaimHeaderProps {
  className?: string;
  activeMode?: 'explore' | 'stress-test';
  onModeChange?: (mode: 'explore' | 'stress-test') => void;
}

/**
 * ClaimHeader component.
 * Displays the Memory Design Lab title, subtitle, central scientific claim,
 * audience, prerequisites, mode selector, and educational/live computation tags.
 */
export function ClaimHeader({
  className = '',
  activeMode = 'explore',
  onModeChange,
}: ClaimHeaderProps) {
  return (
    <header className={`space-y-5 ${className}`}>
      {/* 1. Main Title & Positioning */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              DataForge 2026 · Pathway Track
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-2 text-muted border border-border">
              TOPIC: Associative Memory and Fast Weights
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
            MEMORY DESIGN LAB
          </h1>
          <p className="mt-1 text-sm sm:text-base font-medium text-foreground/90">
            Stress-test bounded AI memory before you ship it
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Scientific Foundation: <em>MEMORY UNDER PRESSURE — How Fixed-State Associative Memory Trades Memory Growth for Interference</em>
          </p>
        </div>

        {/* 2. Interactive Mode Selector Switch */}
        {onModeChange && (
          <div className="flex items-center bg-surface-2 p-1 rounded-lg border border-border self-start md:self-end">
            <button
              onClick={() => onModeChange('explore')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeMode === 'explore'
                  ? 'bg-accent text-white shadow-sm font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span>🔬 Explore the Science</span>
            </button>
            <button
              onClick={() => onModeChange('stress-test')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeMode === 'stress-test'
                  ? 'bg-accent text-white shadow-sm font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <span>⚡ Stress-Test a Scenario</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Central Falsifiable Claim */}
      <div className="bg-surface rounded-lg border border-border border-l-4 border-l-accent p-4 sm:p-5 shadow-sm space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold block">
          Central Falsifiable Claim
        </span>
        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          &ldquo;A fixed-size linear associative memory can process a stream of arbitrary length without allocating a new memory slot for every association, but retrieval error can increase when stored key vectors overlap because other associations contribute cross-talk to the queried memory.&rdquo;
        </p>
      </div>

      {/* 4. Audience & Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-surface rounded-lg border border-border p-3">
          <span className="font-semibold text-foreground">Target Audience: </span>
          <span className="text-muted">
            ML engineers building streaming/memory agents, data scientists, advanced undergraduate learners
          </span>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3">
          <span className="font-semibold text-foreground">Prerequisites: </span>
          <span className="text-muted">
            Vectors, dot products, matrix outer products, and basic attention familiarity
          </span>
        </div>
      </div>

      {/* 5. Provenance Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 border border-border px-2.5 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          LIVE COMPUTATION · Results calculated in browser from stated linear algebra
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 border border-border px-2.5 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          EDUCATIONAL TOY MODEL · Isolates associative-memory behavior
        </span>
      </div>
    </header>
  );
}

export default ClaimHeader;
