import React from 'react';

export interface ClaimHeaderProps {
  className?: string;
  activeMode?: 'explore' | 'stress-test';
  onModeChange?: (mode: 'explore' | 'stress-test') => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  viewMode?: 'story' | 'expert';
  onViewModeChange?: (mode: 'story' | 'expert') => void;
}

/**
 * ClaimHeader component.
 * Displays the Memory Design Lab title, subtitle, central scientific claim,
 * intuitive chalkboard analogy, tab navigation, and educational/live computation tags.
 */
export function ClaimHeader({
  className = '',
  activeMode = 'explore',
  onModeChange,
  activeTab = 'playground',
  onTabChange,
  viewMode = 'story',
  onViewModeChange,
}: ClaimHeaderProps) {
  const [showAnalogy, setShowAnalogy] = React.useState(true);

  const navTabs = [
    { id: 'playground', label: '🎮 Chalkboard Lab', badge: 'Interactive' },
    { id: 'scenarios', label: '⚡ Real Scenarios', badge: 'Practical' },
    { id: 'math', label: '📐 Deep Math', badge: 'Algebra' },
    { id: 'bdh', label: '🧠 BDH Brain Lens', badge: 'Neuromorphic' },
    { id: 'sources', label: '📚 Research & Papers', badge: 'Verified' },
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    if (onModeChange) {
      if (tabId === 'scenarios') {
        onModeChange('stress-test');
      } else {
        onModeChange('explore');
      }
    }
  };

  return (
    <header className={`space-y-4 ${className}`}>
      {/* 1. Main Navigation & Title Bar */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-border/80 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold px-2 py-0.5 rounded bg-accent/15 border border-accent/30">
                DataForge 2026 · Pathway Track
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-2 text-muted border border-border">
                TOPIC: Associative Memory and Fast Weights
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-success bg-success/10 px-2 py-0.5 rounded border border-success/30 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live In-Browser Computation
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-accent">
              MEMORY DESIGN LAB
            </h1>
            <p className="mt-1 text-sm sm:text-base font-medium text-foreground/90">
              Stress-test bounded AI memory before you ship it
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Scientific Foundation: <em className="text-foreground/80 font-medium">MEMORY UNDER PRESSURE — How Fixed-State Associative Memory Trades Memory Growth for Interference</em>
            </p>
          </div>

          {/* Level / View Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {onViewModeChange && (
              <div className="flex items-center bg-surface p-1 rounded-xl border border-border text-xs">
                <button
                  type="button"
                  onClick={() => onViewModeChange('story')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'story'
                      ? 'bg-accent text-white font-semibold shadow'
                      : 'text-muted hover:text-foreground'
                  }`}
                  aria-label="Switch to Story Mode"
                >
                  <span>🎓 Visual / Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('expert')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'expert'
                      ? 'bg-accent text-white font-semibold shadow'
                      : 'text-muted hover:text-foreground'
                  }`}
                  aria-label="Switch to Math Mode"
                >
                  <span>🔬 Expert / Math</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowAnalogy(!showAnalogy)}
              className="px-3 py-1.5 rounded-xl border border-border bg-surface-2 text-xs text-foreground/90 hover:border-accent transition flex items-center gap-1.5"
            >
              <span>💡</span>
              <span>{showAnalogy ? 'Hide Chalkboard Analogy' : 'Explain Like I\'m 10'}</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive Navigation Tabs */}
        <nav
          role="tablist"
          aria-label="Application sections"
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
        >
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? 'bg-accent text-white shadow-md font-semibold'
                    : 'bg-surface-2/60 text-muted hover:text-foreground hover:bg-surface-2 border border-border/60'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface text-muted border border-border/50'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. The Chalkboard Analogy (Beginner-friendly visual card) */}
      {showAnalogy && (
        <div className="glass-card rounded-2xl p-5 border border-accent/30 bg-gradient-to-br from-accent/5 via-surface to-surface-2 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <h3 className="text-sm font-bold text-foreground">
                How It Works: The Chalkboard vs. The Infinite Filing Cabinet
              </h3>
            </div>
            <span className="text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">
              30-Second Intuition
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-surface/80 rounded-xl p-3 border border-border/70 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <span>🗄️</span>
                <span>Standard AI (Filing Cabinet)</span>
              </div>
              <p className="text-muted leading-relaxed">
                Standard Transformers write every word on a new index card (<code className="text-accent">KV Cache</code>). It never forgets, but your room fills with millions of cabinets (<span className="font-mono text-warning">O(N)</span> memory growth)!
              </p>
            </div>

            <div className="bg-surface/80 rounded-xl p-3 border border-border/70 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <span>📋</span>
                <span>Our AI (The Single Chalkboard)</span>
              </div>
              <p className="text-muted leading-relaxed">
                Fast-weight associative memory has only <strong>one fixed board</strong> (<span className="font-mono text-success">O(1)</span> constant size). New facts are written directly over the same board. Your memory never grows!
              </p>
            </div>

            <div className="bg-surface/80 rounded-xl p-3 border border-accent/40 bg-accent/5 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-accent">
                <span>🌫️</span>
                <span>The Chalk Smudge (Cross-Talk)</span>
              </div>
              <p className="text-muted leading-relaxed">
                When clues sound similar (high overlap <span className="font-mono text-accent">ρ</span>), their chalk marks smudge together! That smudge is <strong>cross-talk interference</strong>. This lab lets you observe and fix it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Central Falsifiable Claim */}
      <div className="bg-surface rounded-xl border border-border border-l-4 border-l-accent p-4 sm:p-5 shadow-sm space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold block">
            Central Falsifiable Scientific Claim
          </span>
          <span className="text-[10px] font-mono text-muted bg-surface-2 px-2 py-0.5 rounded border border-border">
            Verified by Live Math
          </span>
        </div>
        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
          &ldquo;A fixed-size linear associative memory can process a stream of arbitrary length without allocating a new memory slot for every association, but retrieval error can increase when stored key vectors overlap because other associations contribute cross-talk to the queried memory.&rdquo;
        </p>
      </div>

      {/* 5. Provenance & Boundary Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 border border-border px-3 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          <strong className="text-foreground/90 font-medium">LIVE COMPUTATION</strong> · Results calculated in browser from stated linear algebra
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 border border-border px-3 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          <strong className="text-foreground/90 font-medium">EDUCATIONAL TOY MODEL</strong> · Isolates associative-memory behavior
        </span>
      </div>
    </header>
  );
}

export default ClaimHeader;
