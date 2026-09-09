# Memory Under Pressure — Task Tracker

## Stage 1 — Architecture + Scaffold
- [x] Next.js 14 project scaffold (App Router, TypeScript, Tailwind)
- [x] Install vitest + vite
- [x] Create vitest.config.ts
- [x] Establish `src/lib/` directory structure

## Stage 2 — Core Mathematical Engine
- [x] `random.ts` — Seeded PRNG (mulberry32) + Box-Muller Gaussian
- [x] `vector.ts` — normalize, dot, outerProduct, matVecMul, cosineSimilarity, mse
- [x] `generators.ts` — Key generation with `sqrt(ρ)` correlation, value generation, meanPairwiseCosine
- [x] `associativeMemory.ts` — Hebbian write, Delta write, retrieve, buildMemory
- [x] `exactKVReference.ts` — Exact KV store for comparison baseline
- [x] `metrics.ts` — Per-query and aggregate retrieval quality
- [x] `crossTalk.ts` — Cross-talk decomposition + ratio
- [x] `experiments.ts` — runExperiment, runErrorVsNSweep

## Stage 3 — Tests
- [x] `random.test.ts` — PRNG determinism, range, Gaussian normality (7 tests)
- [x] `vector.test.ts` — All vector/matrix ops (18 tests)
- [x] `generators.test.ts` — Key normalization, determinism, ρ effect (7 tests)
- [x] `associativeMemory.test.ts` — Hand-checkable fixture, cross-talk, delta rule (8 tests)
- [x] `exactKVReference.test.ts` — Retrieval, immutability, error cases (6 tests)
- [x] `metrics.test.ts` — Quality metrics, overlap effect (4 tests)
- [x] `crossTalk.test.ts` — Decomposition, additive property, ratio (5 tests)
- [x] `experiments.test.ts` — Reproducibility, sweep determinism, rho/N effects (9 tests)
- [x] **ALL 76 INITIAL TESTS PASS** ✅

## Stage 4 — Interactive UI + Audit Fixes
- [x] `useExperiment.ts` hook — Reactive state, live recomputation, sweep generation, fair Hebbian vs Delta comparison on identical data
- [x] `ClaimHeader.tsx` — Central falsifiable claim, audience, prerequisites, provenance badges
- [x] `PresetBar.tsx` — 4 presets (Clean Memory, Memory Pressure, High Overlap, Update Rules)
- [x] `ControlPanel.tsx` — 4 primary controls (d, N, ρ, rule) + seed input with explanatory labels
- [x] `MemoryHeatmap.tsx` — Live SVG heatmap of $d \times d$ memory matrix with diverging color scale
- [x] `RetrievalPanel.tsx` — Query selector, Ground Truth vs Model Retrieval vs Error vectors, per-query and aggregate metrics
- [x] `ErrorChart.tsx` — Renamed to "Retrieval Error vs. Number of Associations" with Normalized Retrieval Error (MSE) as primary line and explicit non-monotonic/key-geometry notes (Fix 1)
- [x] `CrossTalkExplainer.tsx` — Exact Hebbian decomposition labeled exclusively for Hebbian; Delta mode displays separate non-additive explanation (Fix 2)
- [x] `ControlPanel.tsx` & `RetrievalPanel.tsx` — Explicit ρ semantics: configured ρ vs measured mean key overlap clearly labeled (Fix 3)
- [x] `UpdateRuleComparison.tsx` — Verified identical inputs with "Same data; different update rule." label (Fix 4)
- [x] Full application terminology audit: "Fixed Associative State", "Exact KV Reference", "Hebbian", "Delta", "Retrieval Error", "Mean Cosine Similarity", "Key Overlap" (Fix 5)
- [x] Scientific scope notice prominently placed beside live experiment (Fix 6)
- [x] Component unit tests updated (`__tests__/components.test.ts`)
- [x] Full test suite: **83/83 tests passing across 9 test files** ✅
- [x] TypeScript check: `tsc --noEmit` passed with 0 errors ✅
- [x] Next.js build: `next build` compiled with 0 errors, prerendered static pages ✅
- [x] Production server verified live on `http://localhost:3001` ✅

## Stage 5 — Visual Polish
- [x] Information hierarchy established: Claim Header & audience $\rightarrow$ Presets $\rightarrow$ Scientific Controls $\rightarrow$ Live Experiment Centerpiece
- [x] High information-to-space ratio, dense technical typography, calm dark theme
- [x] Presets visually distinct with clear active state badges (A CLEAN, B PRESSURE, C HIGH OVERLAP, D UPDATE RULES)
- [x] Exact KV reference styled as pedagogical baseline
- [x] Responsive layout verified across mobile (375px), tablet (768px), and desktop (1024px, 1440px)
- [x] Keyboard focus states, ARIA labels, semantic headings, and color contrast verified

## Stage 6 — BDH Primary-Source Module
- [x] `BDHLens.tsx` fully implemented and wired into `page.tsx`
- [x] Direct primary source links included: BDH (arXiv:2509.26507) and BDH-CQ (arXiv:2608.09888)
- [x] Explicitly distinguished from Mamba-style SSMs
- [x] Conceptual mapping side-by-side: Our Toy vs BDH Concept
- [x] Essential disclaimer present: "Both involve state that changes during inference, but the implementations and mathematical structures are different."
- [x] Hebbian conceptual form formula with architectural context: $\Delta \text{synapse}_{ij} \propto \text{pre}_j \times \text{post}_i$
- [x] Dynamic Synaptic State (changes) vs Learned Network Parameters (remains fixed) table
- [x] BDH-CQ bridge section explaining continuous recurrent updates + latent iterative reasoning
- [x] Visible evidence badges: `[PUBLISHED BDH FACT]`, `[EDUCATIONAL ABSTRACTION]`, `[LIVE TOY COMPUTATION]`
- [x] Full scientific limitations box
- [x] Updated `Sources.tsx` with all 5 verified papers and direct arXiv URLs

## Stage 7 — Documentation & Evidence
- [x] `README.md` — Technically precise, complete project overview, learning objectives, reproduction guide
- [x] `SOURCES.md` — Rigorous breakdown of literature roles (Toy vs RetNet/GLA/DeltaNet vs BDH vs BDH-CQ)
- [x] `AI_DISCLOSURE.md` — Transparent record of AI assistance and independent human engineering verification
- [x] `EVIDENCE.md` — Empirically measured numbers from Acceptance Tests 1–5 and floating-point cross-talk proof
- [x] `LICENSE` — MIT License with academic citation notices
- [x] Repository vocabulary audit complete (no ungrounded "proves", "guarantees", "solves", etc.)
- [x] Full test suite expanded: **89/89 tests passing across 10 test files** ✅
- [x] `tsc --noEmit` passing with 0 errors ✅
- [x] `next build` passing with 0 errors ✅

## Stage 8 — PDF (Pending Next Instruction)
- [ ] One-page concept summary

## Stage 9 — Browser Testing
- [ ] Chrome/Edge manual test walkthrough
- [ ] Presets A-D validation
- [ ] Challenge interaction check

## Stage 10 — Final Judge Audit
- [ ] Rubric compliance audit
