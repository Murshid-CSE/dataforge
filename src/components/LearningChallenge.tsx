'use client';

import React, { useState, useMemo } from 'react';
import { runExperiment } from '@/lib/experiments';

export interface LearningChallengeProps {
  onRunExperiment: (d: number, N: number, rho: number) => void;
  currentMeanCosine: number;
}

type Phase = 'predict' | 'reveal' | 'reflect';
type ChoiceId = 'A' | 'B' | 'C';

interface ChoiceOption {
  id: ChoiceId;
  label: string;
}

const CHOICES: ChoiceOption[] = [
  { id: 'A', label: 'Error will increase' },
  { id: 'B', label: 'Error will decrease' },
  { id: 'C', label: 'Error will stay approximately unchanged' },
];

export function LearningChallenge({
  onRunExperiment,
  currentMeanCosine,
}: LearningChallengeProps) {
  const [phase, setPhase] = useState<Phase>('predict');
  const [selectedChoice, setSelectedChoice] = useState<ChoiceId | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Compute challenge results internally with seed=42
  const resultLowRho = useMemo(() => {
    return runExperiment({
      seed: 42,
      d: 8,
      N: 20,
      rho: 0.1,
      rule: 'hebbian',
    });
  }, []);

  const resultHighRho = useMemo(() => {
    return runExperiment({
      seed: 42,
      d: 8,
      N: 20,
      rho: 0.8,
      rule: 'hebbian',
    });
  }, []);

  const handleSelectChoice = (choiceId: ChoiceId) => {
    setSelectedChoice(choiceId);
    setPhase('reveal');
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompleted(true);
  };

  const handleReset = () => {
    setPhase('predict');
    setSelectedChoice(null);
    setReflectionText('');
    setIsCompleted(false);
  };

  const isCorrect = selectedChoice === 'A';

  return (
    <section
      className="bg-surface rounded-lg border border-border p-6 flex flex-col gap-6"
      aria-labelledby="challenge-title"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-accent">
            Interactive Drill
          </span>
          <h2
            id="challenge-title"
            className="text-xl font-semibold text-foreground mt-0.5 tracking-tight"
          >
            60-Second Learning Challenge
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-muted">
            Playground Cos: <span className="text-foreground">{currentMeanCosine.toFixed(3)}</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-md border border-border bg-surface-2 hover:bg-surface text-xs font-medium text-foreground transition-colors"
          >
            Reset Challenge
          </button>
        </div>
      </div>

      {/* Phase Stepper */}
      <nav aria-label="Challenge progress" className="flex items-center gap-2 text-xs font-mono">
        <span
          className={`px-2.5 py-1 rounded transition-colors ${
            phase === 'predict'
              ? 'bg-accent/20 border border-accent text-accent font-semibold'
              : 'bg-surface-2 text-muted border border-border'
          }`}
        >
          1. Predict
        </span>
        <span className="text-muted" aria-hidden="true">→</span>
        <span
          className={`px-2.5 py-1 rounded transition-colors ${
            phase === 'reveal'
              ? 'bg-accent/20 border border-accent text-accent font-semibold'
              : phase === 'reflect'
              ? 'bg-surface-2 text-foreground border border-border'
              : 'bg-surface-2 text-muted border border-border'
          }`}
        >
          2. Reveal
        </span>
        <span className="text-muted" aria-hidden="true">→</span>
        <span
          className={`px-2.5 py-1 rounded transition-colors ${
            phase === 'reflect'
              ? 'bg-accent/20 border border-accent text-accent font-semibold'
              : 'bg-surface-2 text-muted border border-border'
          }`}
        >
          3. Reflect
        </span>
      </nav>

      {/* Phase 1: PREDICT */}
      {phase === 'predict' && (
        <div className="flex flex-col gap-5">
          {/* Setup parameters */}
          <div className="bg-surface-2 border border-border rounded-md p-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Experimental Setup
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-muted block">Dimension (d)</span>
                <span className="text-foreground font-semibold">8</span>
              </div>
              <div>
                <span className="text-muted block">Associations (N)</span>
                <span className="text-foreground font-semibold">20</span>
              </div>
              <div>
                <span className="text-muted block">Initial Overlap (ρ)</span>
                <span className="text-foreground font-semibold">0.1</span>
              </div>
              <div>
                <span className="text-muted block">PRNG Seed</span>
                <span className="text-foreground font-semibold">42</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm sm:text-base font-medium text-foreground">
              What do you predict will happen to retrieval error when key overlap increases from ρ=0.1 to ρ=0.8?
            </p>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {CHOICES.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleSelectChoice(choice.id)}
                  className="flex items-center gap-3 w-full text-left p-3.5 rounded-lg border border-border bg-surface-2 hover:border-accent hover:bg-surface transition-colors group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-md bg-surface border border-border text-xs font-mono font-bold text-accent group-hover:border-accent">
                    {choice.id}
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {choice.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: REVEAL */}
      {phase === 'reveal' && (
        <div className="flex flex-col gap-5">
          {/* Computed Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-2 border border-border rounded-lg p-4 flex flex-col gap-1">
              <span className="text-xs font-mono text-muted">ρ = 0.1 result</span>
              <div className="text-2xl font-mono font-bold text-foreground">
                {resultLowRho.aggregate.meanCosine.toFixed(4)}
              </div>
              <span className="text-xs text-muted">Mean Cosine Similarity</span>
            </div>

            <div className="bg-surface-2 border border-border rounded-lg p-4 flex flex-col gap-1">
              <span className="text-xs font-mono text-muted">ρ = 0.8 result</span>
              <div className="text-2xl font-mono font-bold text-foreground">
                {resultHighRho.aggregate.meanCosine.toFixed(4)}
              </div>
              <span className="text-xs text-muted">Mean Cosine Similarity</span>
            </div>
          </div>

          {/* Correct / Incorrect evaluation */}
          <div
            className={`p-4 rounded-lg border text-sm leading-relaxed ${
              isCorrect
                ? 'bg-success/10 border-success/30 text-success'
                : 'bg-warning/10 border-warning/30 text-warning'
            }`}
          >
            <div className="font-semibold mb-1">
              {isCorrect ? '✓ Correct Prediction' : '✗ Incorrect Prediction'}
            </div>
            <p className="text-foreground/90 text-sm">
              You selected: <span className="font-mono font-semibold">{selectedChoice}</span> (
              {CHOICES.find((c) => c.id === selectedChoice)?.label}). Correct answer:{' '}
              <span className="font-semibold">A — Error will increase</span> (cosine similarity
              dropped from {resultLowRho.aggregate.meanCosine.toFixed(3)} to{' '}
              {resultHighRho.aggregate.meanCosine.toFixed(3)}).
            </p>
          </div>

          {/* Explanation */}
          <div className="bg-surface-2 border-l-4 border-accent p-4 rounded-r text-sm text-foreground/90 leading-relaxed">
            Higher key overlap means more cross-talk: other stored associations leak into retrieval because their keys share direction with the query key.
          </div>

          {/* Navigation and Playground Sync */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => onRunExperiment(8, 20, 0.8)}
              className="px-3.5 py-2 rounded-md border border-border bg-surface-2 hover:bg-surface text-xs font-mono text-foreground transition-colors"
            >
              Load ρ=0.8 into Playground (d=8, N=20)
            </button>

            <button
              type="button"
              onClick={() => setPhase('reflect')}
              className="px-4 py-2 rounded-md bg-accent hover:bg-blue-600 text-white text-xs font-medium transition-colors"
            >
              Proceed to Reflection →
            </button>
          </div>
        </div>
      )}

      {/* Phase 3: REFLECT */}
      {phase === 'reflect' && (
        <div className="flex flex-col gap-5">
          <form onSubmit={handleComplete} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="reflection-input"
                className="block text-sm font-medium text-foreground mb-2"
              >
                In one sentence, why does key overlap create cross-talk?
              </label>
              <textarea
                id="reflection-input"
                rows={3}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Share your reasoning (e.g. projection of other keys onto query key)..."
                disabled={isCompleted}
                className="w-full rounded-md border border-border bg-surface-2 p-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent disabled:opacity-75 resize-none"
              />
            </div>

            {!isCompleted && (
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-accent hover:bg-blue-600 text-white text-xs font-medium transition-colors"
                >
                  Complete Challenge
                </button>
              </div>
            )}
          </form>

          {isCompleted && (
            <div className="bg-surface-2 border border-accent/40 rounded-lg p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-success text-sm font-semibold">
                <span>✓</span>
                <span>Challenge complete.</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                The core mechanism:{' '}
                <span className="font-mono text-accent font-semibold">
                  cross-talk = Σ v_i (k_i^T k_j)
                </span>{' '}
                — overlap between keys determines how much each stored value leaks into the retrieval of another.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default LearningChallenge;
