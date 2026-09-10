'use client';

import React, { useState } from 'react';

export interface RetrievalPanelProps {
  queryIndex: number;
  groundTruth: number[];
  retrieved: number[];
  cosine: number;
  mse: number;
  meanCosine: number;
  meanMSE: number;
  N: number;
  measuredPairwiseCosine: number;
  onQueryChange: (index: number) => void;
  viewMode?: 'story' | 'expert';
}

/**
 * Format vector component value with 3 decimal places and sign alignment.
 */
function formatComponent(val: number): string {
  if (!Number.isFinite(val)) return ' 0.000';
  if (Math.abs(val) < 1e-5) return ' 0.000';
  return val >= 0 ? `+${val.toFixed(3)}` : val.toFixed(3);
}

// 24 realistic, memorable concept associations for the Beginner / Story Mode
const STORY_MEMORIES = [
  { prompt: '👤 Customer Shipping Address', fact: '124 Market Street, Suite 400', topic: 'Order Logistics' },
  { prompt: '💳 Customer Billing Address', fact: '789 Commerce Way, Floor 2', topic: 'Order Logistics' },
  { prompt: '🔐 User Secret Passcode', fact: 'Alpha-992-Omega', topic: 'Security' },
  { prompt: '🔑 Admin Root Key', fact: 'Quantum-Cipher-77', topic: 'Security' },
  { prompt: '🎨 User Favorite Color', fact: 'Cobalt Ocean Blue', topic: 'User Preferences' },
  { prompt: '🌟 User Accent Theme', fact: 'Electric Sky Cyan', topic: 'User Preferences' },
  { prompt: '🛫 Flight Departure Gate', fact: 'Gate B14 (San Francisco)', topic: 'Travel' },
  { prompt: '🛬 Flight Arrival Gate', fact: 'Gate A22 (Tokyo Haneda)', topic: 'Travel' },
  { prompt: '🏥 Primary Physician', fact: 'Dr. Sarah Connor, MD', topic: 'Medical' },
  { prompt: '🩺 Attending Specialist', fact: 'Dr. John Watson, Surgery', topic: 'Medical' },
  { prompt: '🐶 Pet Name & Breed', fact: 'Barnaby (Golden Retriever)', topic: 'Personal' },
  { prompt: '🐱 Secondary Pet', fact: 'Milo (Calico Cat)', topic: 'Personal' },
  { prompt: '📱 Phone Model', fact: 'Apex Quantum 12 Pro', topic: 'Devices' },
  { prompt: '💻 Laptop Model', fact: 'Titan Silicon Book 16', topic: 'Devices' },
  { prompt: '🏢 Office Headquarters', fact: 'One Silicon Plaza, Austin', topic: 'Work' },
  { prompt: '🏭 Regional Warehouse', fact: 'Hub 4, Logistics Park Dallas', topic: 'Work' },
  { prompt: '☕ Morning Beverage Order', fact: 'Double Espresso with Oat Milk', topic: 'Habits' },
  { prompt: '🍵 Afternoon Tea Preference', fact: 'Japanese Sencha Green', topic: 'Habits' },
  { prompt: '🚗 Car License Plate', fact: '7XYZ892 (Silver Sedan)', topic: 'Vehicle' },
  { prompt: '🛵 Scooter Registration', fact: 'SC-441-TX (Electric Blue)', topic: 'Vehicle' },
  { prompt: '📅 Project Deadline', fact: 'November 15 at 17:00 UTC', topic: 'Schedule' },
  { prompt: '📆 Product Launch Date', fact: 'December 01 at 09:00 UTC', topic: 'Schedule' },
  { prompt: '🎵 Favorite Music Genre', fact: 'Synthwave & Electronic Lo-Fi', topic: 'Interests' },
  { prompt: '📚 Favorite Book Title', fact: 'Gödel, Escher, Bach', topic: 'Interests' },
];

export function RetrievalPanel({
  queryIndex,
  groundTruth,
  retrieved,
  cosine,
  mse,
  meanCosine,
  meanMSE,
  N,
  measuredPairwiseCosine,
  onQueryChange,
  viewMode: initialViewMode = 'story',
}: RetrievalPanelProps) {
  const [internalViewMode, setInternalViewMode] = useState<'story' | 'expert'>(initialViewMode);
  const activeView = internalViewMode;

  // Vector dimension
  const length = Math.max(groundTruth.length, retrieved.length);

  // Compute element-wise difference: retrieved - groundTruth
  const errorVector = Array.from({ length }, (_, i) => {
    const r = retrieved[i] ?? 0;
    const g = groundTruth[i] ?? 0;
    return r - g;
  });

  // Calculate Memory Clarity percentage (0 to 100%)
  const clarityPercent = Math.max(0, Math.min(100, Math.round(cosine * 1000) / 10));

  // Qualitative Clarity classification
  let clarityLabel = '💎 Crystal Clear (Zero Smudge)';
  let clarityBadgeStyle = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  let gaugeColor = '#10b981'; // emerald-500

  if (cosine < 0.8) {
    clarityLabel = '🌫️ Severe Smudge (High Interference)';
    clarityBadgeStyle = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    gaugeColor = '#f43f5e'; // rose-500
  } else if (cosine < 0.95) {
    clarityLabel = '⚠️ Noticeable Smudge (Partial Bleed)';
    clarityBadgeStyle = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    gaugeColor = '#f59e0b'; // amber-500
  }

  // Story mode concept info
  const storyItem = STORY_MEMORIES[queryIndex % STORY_MEMORIES.length] || {
    prompt: `Association Item #${queryIndex}`,
    fact: `Stored Fact Record ${queryIndex}`,
    topic: 'General Data',
  };

  const adjacentItem = STORY_MEMORIES[(queryIndex + 1) % STORY_MEMORIES.length] || {
    prompt: 'Other Memory Item',
    fact: 'Secondary Association',
    topic: 'Adjacent Topic',
  };

  return (
    <div className="glass-card rounded-2xl border border-border/80 p-5 sm:p-6 flex flex-col gap-5 shadow-lg">
      {/* 1. Header with Query Selector & Story/Expert Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <label
            htmlFor="query-association-select"
            className="text-sm font-semibold text-foreground whitespace-nowrap flex items-center gap-1.5"
          >
            <span>🎯</span> Query association:
          </label>
          <select
            id="query-association-select"
            value={queryIndex}
            onChange={(e) => onQueryChange(Number(e.target.value))}
            className="bg-surface text-foreground border border-border rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition shadow-sm"
            aria-label="Select query association"
          >
            {Array.from({ length: Math.max(1, N) }, (_, i) => (
              <option key={i} value={i}>
                Association #{i} {STORY_MEMORIES[i % STORY_MEMORIES.length]?.prompt.split(' ')[1] ? `(${STORY_MEMORIES[i % STORY_MEMORIES.length]?.prompt.split(' ')[1]})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Mini Switcher & Association counter label */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface p-0.5 rounded-lg border border-border text-[11px]">
            <button
              type="button"
              onClick={() => setInternalViewMode('story')}
              className={`px-2.5 py-1 rounded-md transition ${
                activeView === 'story'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Story Mode
            </button>
            <button
              type="button"
              onClick={() => setInternalViewMode('expert')}
              className={`px-2.5 py-1 rounded-md transition ${
                activeView === 'expert'
                  ? 'bg-accent text-white font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Math Vectors
            </button>
          </div>
          <p className="text-xs text-muted font-mono hidden sm:block">
            Displaying query {queryIndex} of {N} stored associations
          </p>
        </div>
      </div>

      {/* 2. Innovative Memory Clarity Scoreboard */}
      <div className="bg-gradient-to-br from-surface-2/80 via-surface to-surface-2/60 rounded-xl border border-border/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Clarity Score and Label */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Circular Progress Gauge */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-2"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${Math.max(0, Math.min(100, clarityPercent))}, 100`}
                strokeLinecap="round"
                stroke={gaugeColor}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-foreground">
              {Math.round(clarityPercent)}%
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
                Memory Clarity
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${clarityBadgeStyle}`}>
                {clarityLabel}
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-snug">
              {cosine > 0.95
                ? 'The AI retrieved this memory crisply with virtually no chalk smudge.'
                : cosine > 0.8
                ? 'Minor chalk bleed from other stored notes; usable but noticeably smudged.'
                : 'Severe interference: multiple memories have bled together on the single board.'}
            </p>
          </div>
        </div>

        {/* Right: Cosine & MSE Stats */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-border/70 pt-3 sm:pt-0 sm:pl-5 w-full sm:w-auto justify-around sm:justify-end">
          <div>
            <span className="text-[11px] font-mono text-muted uppercase block">Cosine Similarity</span>
            <span className="font-mono text-lg font-bold text-foreground">
              {cosine.toFixed(4)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-muted uppercase block">Normalized Error (MSE)</span>
            <span className="font-mono text-lg font-bold text-cross-talk">
              {mse.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. DUAL-LAYER RETRIEVAL CONTENT */}
      {activeView === 'story' ? (
        /* VISUAL STORY MODE (Understandable by anyone) */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Fact Card */}
            <div className="bg-surface-2/60 rounded-xl p-4 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>🎯</span> Expected Fact (Ground Truth)
                </span>
                <span className="text-[10px] font-mono bg-surface px-2 py-0.5 rounded border border-border text-muted">
                  What we asked for
                </span>
              </div>
              <div className="bg-surface rounded-lg p-3 border border-border/60">
                <p className="text-xs text-muted font-mono mb-1">{storyItem.prompt}</p>
                <p className="text-sm font-bold text-foreground">{storyItem.fact}</p>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                This is the pristine fact stored in memory during training/streaming.
              </p>
            </div>

            {/* AI Retrieved Card */}
            <div className={`rounded-xl p-4 border space-y-2 ${
              cosine > 0.95
                ? 'bg-surface-2/60 border-emerald-500/30'
                : cosine > 0.8
                ? 'bg-surface-2/60 border-amber-500/30'
                : 'bg-surface-2/60 border-rose-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-retrieved flex items-center gap-1.5">
                  <span>🧠</span> AI Memory Recall (Retrieved)
                </span>
                <span className="text-[10px] font-mono bg-surface px-2 py-0.5 rounded border border-border text-muted">
                  From {length}×{length} Board
                </span>
              </div>
              <div className="bg-surface rounded-lg p-3 border border-border/60">
                <p className="text-xs text-muted font-mono mb-1">Querying: {storyItem.prompt}</p>
                {cosine > 0.95 ? (
                  <p className="text-sm font-bold text-emerald-400">
                    &ldquo;{storyItem.fact}&rdquo; <span className="text-xs font-normal text-muted">(Spot-on)</span>
                  </p>
                ) : cosine > 0.8 ? (
                  <p className="text-sm font-bold text-amber-300">
                    &ldquo;{storyItem.fact}&rdquo; <span className="text-xs font-normal text-amber-400/80">(Faint smudge of &ldquo;{adjacentItem.fact}&rdquo;)</span>
                  </p>
                ) : (
                  <p className="text-sm font-bold text-rose-400">
                    &ldquo;{storyItem.fact} ...[Heavily smudged with {adjacentItem.fact}]&rdquo;
                  </p>
                )}
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                {cosine > 0.95
                  ? '✨ Memory retrieved without interference. The chalkboard preserved this fact cleanly.'
                  : `🌫️ The AI suffers cross-talk because other keys shared features with this clue.`}
              </p>
            </div>
          </div>

          {/* Intuitive Smudge Explainer Banner */}
          <div className="bg-surface-2/40 rounded-xl p-3 border border-border/70 flex items-center justify-between text-xs text-muted gap-3">
            <span className="flex items-center gap-2">
              <span>💡</span>
                Want to see the raw linear algebra coordinates (v, v̂, and error difference)?
            </span>
            <button
              type="button"
              onClick={() => setInternalViewMode('expert')}
              className="px-3 py-1 bg-surface border border-border rounded-lg text-foreground hover:border-accent text-xs font-mono whitespace-nowrap transition"
            >
              Inspect Math Vectors →
            </button>
          </div>
        </div>
      ) : (
        /* EXPERT MATH MODE (Full Linear Algebra Vectors) */
        <div>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Vector Representations (d = {length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Ground Truth */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between px-1">
                <span className="text-ground-truth font-semibold text-xs tracking-wider uppercase">
                  GROUND TRUTH
                </span>
                <span className="text-[11px] text-muted">Expected (v)</span>
              </div>
              <div
                className="bg-surface-2 rounded-xl border border-border p-2 max-h-60 overflow-y-auto divide-y divide-border/20 font-mono text-sm"
                role="list"
                aria-label="Ground truth vector elements"
              >
                {Array.from({ length }, (_, i) => (
                  <div
                    key={`gt-${i}`}
                    className="flex items-center justify-between py-1 px-1.5 hover:bg-surface/50"
                  >
                    <span className="text-muted text-xs select-none">
                      [{i}]
                    </span>
                    <span className="text-ground-truth">
                      {formatComponent(groundTruth[i] ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Retrieval */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between px-1">
                <span className="text-retrieved font-semibold text-xs tracking-wider uppercase">
                  MODEL RETRIEVAL
                </span>
                <span className="text-[11px] text-muted">Memory (v̂ = Mq)</span>
              </div>
              <div
                className="bg-surface-2 rounded-xl border border-border p-2 max-h-60 overflow-y-auto divide-y divide-border/20 font-mono text-sm"
                role="list"
                aria-label="Model retrieved vector elements"
              >
                {Array.from({ length }, (_, i) => (
                  <div
                    key={`ret-${i}`}
                    className="flex items-center justify-between py-1 px-1.5 hover:bg-surface/50"
                  >
                    <span className="text-muted text-xs select-none">
                      [{i}]
                    </span>
                    <span className="text-retrieved">
                      {formatComponent(retrieved[i] ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Vector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between px-1">
                <span className="text-cross-talk font-semibold text-xs tracking-wider uppercase">
                  ERROR
                </span>
                <span className="text-[11px] text-muted">Difference (v̂ - v)</span>
              </div>
              <div
                className="bg-surface-2 rounded-xl border border-border p-2 max-h-60 overflow-y-auto divide-y divide-border/20 font-mono text-sm"
                role="list"
                aria-label="Error vector elements"
              >
                {Array.from({ length }, (_, i) => (
                  <div
                    key={`err-${i}`}
                    className="flex items-center justify-between py-1 px-1.5 hover:bg-surface/50"
                  >
                    <span className="text-muted text-xs select-none">
                      [{i}]
                    </span>
                    <span className="text-cross-talk">
                      {formatComponent(errorVector[i] ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Aggregate Metrics Row across all N */}
      <div className="border-t border-border/70 pt-4">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2.5">
          Aggregate Metrics (All N = {N} Associations)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface-2/60 rounded-xl border border-border/80 p-3 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">Mean Cosine Similarity</span>
            <span className="font-mono text-lg font-bold text-foreground mt-1">
              {meanCosine.toFixed(4)}
            </span>
          </div>

          <div className="bg-surface-2/60 rounded-xl border border-border/80 p-3 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">Retrieval Error (Mean MSE)</span>
            <span className="font-mono text-lg font-bold text-cross-talk mt-1">
              {meanMSE.toFixed(4)}
            </span>
          </div>

          <div className="bg-surface-2/60 rounded-xl border border-border/80 p-3 flex flex-col justify-between">
            <span className="text-xs text-muted font-medium">
              Measured Mean Key Overlap
            </span>
            <span className="font-mono text-lg font-bold text-accent mt-1">
              {measuredPairwiseCosine.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetrievalPanel;
