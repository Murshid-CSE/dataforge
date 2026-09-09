# Memory Design Lab
### Stress-Test Bounded AI Memory Before You Ship It
**Scientific Subtitle**: *Memory Under Pressure: How Fixed-State Associative Memory Trades Memory Growth for Interference*

**DataForge 2026 × Rime Hackathon** — *Pathway Track*  
**Approved Topic**: Associative Memory and Fast Weights  

---

## 1. Central Falsifiable Claim

> &ldquo;A fixed-size linear associative memory can process a stream of arbitrary length without allocating a new memory slot for every association, but retrieval error can increase when stored key vectors overlap because other associations contribute cross-talk to the queried memory.&rdquo;

---

## 2. Intended Learner & Prerequisites

- **Target Audience**: Advanced undergraduate students in computer science/data science, machine learning learners, and early-career AI researchers.
- **Prerequisites**:
  - Linear algebra: vector norms, dot products, matrix-vector multiplication, outer products.
  - Probability: basic Gaussian distributions and unit spheres.
  - Familiarity with the key-value-query concept in attention mechanisms.

---

## 3. Core Learning Objectives

After exploring this interactive artifact, a learner should be able to:
1. **Explain a Bounded Associative State**: Contrast $O(1)$ constant-size recurrent memory ($M \in \mathbb{R}^{d \times d}$) with $O(N)$ uncompressed key-value caching.
2. **Understand Memory Writes**: Describe how key/value associations $(k_t, v_t)$ are written via rank-1 updates.
3. **Analyze Cross-Talk**: Prove why non-orthogonal stored keys leak energy into queries, yielding retrieval cross-talk $\sum_{i \neq j} v_i (k_i^\top k_j)$.
4. **Evaluate Retrieval Error**: Distinguish cosine directional fidelity from normalized mean squared error (MSE).
5. **Differentiate Update Rules**: Contrast unconditional additive Hebbian superposition with error-correcting Delta updates.
6. **Connect to Published Research (The BDH Lens)**: Relate fast-weight outer products to dynamic synaptic plasticity in Dragon Hatchling (BDH) and recurrent latent reasoning in BDH-CQ.
7. **Identify Model Boundaries**: State clearly what this educational toy isolates versus what production foundation models require.

---

## 4. System Architecture & Data Flow

The project is structured into pure functional mathematical modules and reactive UI components:

```text
               ┌──────────────────────────────┐
               │    Interactive Controls      │
               │  d, N, ρ, Rule, Seed, Query  │
               └──────────────┬───────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │   Deterministic Generator    │  (random.ts, generators.ts)
               │    Mulberry32 PRNG + Sqrt(ρ) │
               └──────────────┬───────────────┘
                              │  Keys (k_i), Values (v_i)
                              ▼
        ┌─────────────────────────────────────────────┐
        │        Associative Memory Engine            │  (associativeMemory.ts)
        │  Hebbian: M_t = M_{t-1} + v_t k_t^T         │
        │  Delta:   M_t = M_{t-1} + β(v - Mk)k^T      │
        └──────────────┬──────────────────────────────┘
                       │  Matrix M ∈ R^(d×d)
                       ▼
        ┌─────────────────────────────────────────────┐
        │            Retrieval & Metrics              │  (metrics.ts, exactKVReference.ts)
        │  v̂ = M q   vs.   Exact KV Reference         │
        │  Cosine Similarity, MSE, Overlap            │
        └──────────────┬──────────────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────────┐
        │      Cross-Talk Exact Decomposition         │  (crossTalk.ts)
        │  v̂_j = v_j + Σ_{i≠j} v_i (k_i^T k_j)        │
        └──────────────┬──────────────────────────────┘
                       │
                       ▼
 ┌────────────────────────────────────────────────────────────┐
 │                   Interactive Visualizations               │
 │  • MemoryHeatmap: SVG diverging visualization of M         │
 │  • RetrievalPanel: Ground Truth vs Model vs Error vectors  │
 │  • ErrorChart: Live sweep curve of Error vs Stream Length  │
 │  • CrossTalkExplainer: Term-by-term interference breakdown │
 │  • ExactKVComparison: Compressed vs Uncompressed reference │
 │  • UpdateRuleComparison: Hebbian vs Delta on identical data│
 │  • BDHLens: Primary-source connection to BDH & BDH-CQ      │
 │  • LearningChallenge: 3-phase interactive prediction drill │
 └────────────────────────────────────────────────────────────┘
```

---

## 5. Evidence Discipline & Provenance

To maintain total scientific transparency, information across the interface is categorized strictly into three tiers:

| Tier | Category | Scope in this Project | Source / Basis |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **LIVE COMPUTATION** | All memory states $M$, retrieved vectors $\hat{v}$, element-wise error vectors, cosine metrics, MSE errors, and sweep curves. | Pure TypeScript math engine running deterministically in the client browser. |
| **Tier 2** | **EDUCATIONAL ABSTRACTION** | Simplified outer-product memory simulator, exact KV reference baseline, and conceptual toy-to-BDH mapping. | Pedagogical models designed to isolate mathematical mechanisms cleanly. |
| **Tier 3** | **PUBLISHED RESEARCH** | Scale-free particle network, synaptic plasticity, sparse positive activations in BDH, and recurrent latent reasoning in BDH-CQ. | Direct arXiv primary papers: Kosowski et al. (2025), Engdahl et al. (2026), Sun et al. (2023), Yang et al. (2023, 2024). |

---

## 6. Mathematical Foundations

### 1. Key Overlap Construction
Key vectors are generated using a normalized shared-direction construction where $\rho \in [0, 0.9]$ controls the expected correlation:
$$k_i = \text{normalize}\left(\sqrt{\rho} \cdot s + \sqrt{1 - \rho} \cdot r_i\right)$$
where $s, r_i \in \mathbb{R}^d$ are sampled from $\mathcal{N}(0, I_d)$. The actual pairwise cosine similarity is measured empirically across all key pairs rather than assumed equal to $\rho$.

### 2. Update Rules
- **Additive Hebbian**:
  $$M_t = M_{t-1} + v_t k_t^\top, \quad M_0 = 0$$
- **Error-Correcting Delta Rule**:
  $$M_t = M_{t-1} + \beta (v_t - M_{t-1} k_t) k_t^\top, \quad \beta = 1.0$$
  The Delta rule subtracts the model's current recall error prior to updating. While this substantially reduces retrieval error, it does not completely eliminate cross-talk under non-orthogonal keys in a bounded state.

### 3. Exact Cross-Talk Decomposition (Hebbian)
When queried with a stored unit key $k_j$:
$$\hat{v}_j = M k_j = \underbrace{v_j}_{\text{Target Contribution}} + \underbrace{\sum_{i \neq j} v_i (k_i^\top k_j)}_{\text{Cross-Talk / Interference}}$$
*Important limitation*: This additive decomposition is mathematically exact for the Hebbian update. The interface explicitly does not present this formula as an exact decomposition of the non-linear Delta update.

### 4. Exact KV Reference Baseline
The Exact KV Reference stores associations in an explicit list $\{(k_i, v_i)\}_{i=1}^N$ and retrieves by matching the query key. It serves as an uncompressed pedagogical baseline showing zero retrieval error for stored keys. It is *not* a full Transformer implementation.

---

## 7. Primary Literature Roles

The primary research papers cited in this project fulfill distinct scientific roles (detailed in [`SOURCES.md`](./SOURCES.md)):
1. **Our Educational Toy**: Directly demonstrates that linear associative memory trades bounded state growth for cross-talk interference under key overlap.
2. **RetNet / GLA / DeltaNet / Gated DeltaNet**: Demonstrate that constant-size recurrent memory, error-correcting delta updates, and gated associative recall are active, competitive modern sequence-modeling paradigms ([arXiv:2307.08621](https://arxiv.org/abs/2307.08621), [arXiv:2312.06635](https://arxiv.org/abs/2312.06635), [arXiv:2406.06484](https://arxiv.org/abs/2406.06484), [arXiv:2412.06464](https://arxiv.org/abs/2412.06464)).
3. **Dragon Hatchling (BDH)**: Provides the required neuromorphic anchor (*The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*, Kosowski et al., Sept 30, 2025), showing how inference-time working memory can be implemented via dynamic synaptic plasticity and sparse Hebbian learning in a scale-free particle network ([arXiv:2509.26507](https://arxiv.org/abs/2509.26507)).
4. **BDH-CQ**: Extends the synaptic memory concept to continuous recurrent inference updates and iterative problem-solving in latent space ([arXiv:2608.09888](https://arxiv.org/abs/2608.09888)).

---

## 8. Explicit Scientific Boundaries

1. **Toy Model Disclaimer**: **Does this simulator become BDH?** It does not. The simulator is an educational associative-memory abstraction. BDH is used as a published architectural case study involving dynamic synaptic memory and Hebbian plasticity. It is not an implementation of a production language model, BDH, or BDH-CQ.
2. **No Capacity Universal Threshold**: The project does not claim $N \leq d$ guarantees error-free retrieval or that $N = d$ is a universal failure cliff. Key geometry and overlap dictate error.
3. **Sparsity Does Not Automatically Solve Cross-Talk**: While BDH utilizes sparse positive activations, sparsity in an unconstrained linear outer-product memory does not eliminate interference.
4. **Delta Reduces But Does Not Eliminate Interference**: The Delta update corrects toward target values, but interference persists in a fixed-size state when key vectors overlap.
5. **No Universal Monotonic Law**: Retrieval error curves reflect observed behavior in seeded experiments; fluctuations can occur due to random vector geometry.
6. **No BDH-CQ Claim**: The toy does not reproduce latent reasoning, and our retrieval metrics do not benchmark BDH-CQ.

---

## 9. Local Setup & Reproducibility

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+

### Commands
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run the full automated test suite (95 passing tests)
npx vitest run

# 3. Verify strict TypeScript types (0 errors)
npx tsc --noEmit

# 4. Build optimized production bundle
npm run build

# 5. Start production server locally
npm run start -p 3000

# 6. Run development server with hot-reloading
npm run dev
```

Visit `http://localhost:3000` to interact with the live artifact.

---

## 10. Repository File Structure

```text
├── __tests__/                     # Vitest test suites (88/88 passing)
│   ├── associativeMemory.test.ts  # Memory writing & retrieval tests
│   ├── components.test.ts         # Component render & content tests
│   ├── crossTalk.test.ts          # Cross-talk exact decomposition tests
│   ├── evidence_generation.test.ts# Acceptance test runner & numerical recorder
│   ├── exactKVReference.test.ts   # Explicit KV reference baseline tests
│   ├── experiments.test.ts        # Determinism & sweep curve tests
│   ├── generators.test.ts         # Key/value generation & correlation tests
│   ├── metrics.test.ts            # Cosine similarity & MSE error tests
│   ├── random.test.ts             # Mulberry32 PRNG & Gaussian normality tests
│   └── vector.test.ts             # Linear algebra primitives tests
├── src/
│   ├── app/
│   │   ├── globals.css            # Dark technical aesthetic & KaTeX styling
│   │   ├── layout.tsx             # Root layout with Geist font
│   │   └── page.tsx               # Main educational experience assembly
│   ├── components/                # 13 modular React components
│   │   ├── BDHLens.tsx            # Primary-source BDH & BDH-CQ comparative module
│   │   ├── ClaimHeader.tsx        # Central claim, audience, prerequisites
│   │   ├── ControlPanel.tsx       # Scientific controls (d, N, ρ, rule, seed)
│   │   ├── CrossTalkExplainer.tsx # Exact Hebbian decomposition & Delta notice
│   │   ├── ErrorChart.tsx         # Recharts error vs associations sweep
│   │   ├── ExactKVComparison.tsx  # Fixed associative state vs Exact KV reference
│   │   ├── LearningChallenge.tsx  # 3-phase 60-second interactive drill
│   │   ├── Limitations.tsx        # Honest labels & scientific boundaries
│   │   ├── MemoryHeatmap.tsx      # SVG live memory state matrix inspector
│   │   ├── PresetBar.tsx          # Presets A, B, C, D quick selectors
│   │   ├── RetrievalPanel.tsx     # Ground truth vs model vs error vectors
│   │   ├── Sources.tsx            # Verified primary literature section
│   │   └── UpdateRuleComparison.tsx# Hebbian vs Delta identical-data comparison
│   ├── hooks/
│   │   └── useExperiment.ts       # Reactive experiment state & fair comparison hook
│   └── lib/                       # Pure TypeScript mathematical engine
│       ├── associativeMemory.ts   # Hebbian & Delta update formulations
│       ├── crossTalk.ts           # Exact cross-talk decomposition
│       ├── exactKVReference.ts    # Uncompressed KV store baseline
│       ├── experiments.ts         # Experiment runner & parameter sweeps
│       ├── generators.ts          # Sqrt(ρ) key generation & mean overlap
│       ├── metrics.ts             # Cosine & MSE quality metrics
│       ├── random.ts              # Seeded Mulberry32 PRNG + Box-Muller
│       └── vector.ts              # Vector & matrix arithmetic primitives
├── AI_DISCLOSURE.md               # Human oversight & AI assistance disclosure
├── EVIDENCE.md                    # Measured numerical acceptance test records
├── LICENSE                        # MIT Open Source License
├── package.json                   # Project dependencies & scripts
├── README.md                      # Comprehensive project documentation
├── SOURCES.md                     # Verified primary research literature
├── tsconfig.json                  # Strict TypeScript configuration
└── vitest.config.ts               # Vitest test configuration
```
