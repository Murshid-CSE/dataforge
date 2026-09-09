# Memory Design Lab
### Stress-Test Bounded AI Memory Before You Ship It
**Scientific Subtitle**: *Memory Under Pressure: How Fixed-State Associative Memory Trades Memory Growth for Interference*

**DataForge 2026 × Rime Hackathon** — *Pathway Track*  
**Approved Topic**: Associative Memory and Fast Weights  

**Live GitHub Repository**: [https://github.com/Murshid-CSE/dataforge](https://github.com/Murshid-CSE/dataforge)

---

## 💡 The Core Idea Explained Simply (Even a 10-Year-Old Can Understand!)

Imagine you are in school and your teacher tells you lots of interesting facts. How would an AI remember them?

### The Infinite Filing Cabinet vs. The Single Chalkboard

#### 1. How Regular AI Remembers (The Infinite Filing Cabinet)
Today's popular AI models (like ChatGPT and standard Transformers) remember conversations using something called a **KV Cache**.
* Every time someone says a sentence, the AI writes it on a brand-new paper card and puts it into a filing cabinet.
* **The Good Part**: It never forgets anything! Every card stays neat and readable.
* **The Problem**: If a conversation lasts for hours or days, your room fills up with thousands of filing cabinets. The computer runs out of memory and slows down or crashes ($O(N)$ growth)!

#### 2. How Our Brain and Fast-Weight AI Remember (The Single Chalkboard)
Nature solved this problem differently in our brains. You don't grow new brain cells for every single word you hear! Instead, you have **one fixed-size chalkboard** (a small grid of numbers, like $8 \times 8$).
* When you hear a new fact (e.g., *"The cat's favorite food is Fish"*), you write it directly on the chalkboard.
* When you hear a second fact (e.g., *"The dog's favorite toy is Ball"*), you write it **right on top of the same chalkboard**!
* **The Superpower**: Your backpack never gets heavier! Even if someone speaks a million words, the chalkboard remains the **exact same size** ($O(1)$ constant memory).

#### 3. The Problem: Memory Under Pressure (The "Chalk Smudge")
What happens when you write lots of different notes with chalk on the very same board?
* The chalk starts to **smudge together**!
* If the clues sound very similar (for example, *"Alex's secret number"* and *"Alice's secret number"*), their chalk marks share the same direction and smudge heavily.
* Later, when you ask the board: *"What was Alex's secret number?"*, the board tries to answer, but Alice's secret number leaks into the answer!
* In science, this smudge is called **Cross-Talk Interference**.

#### 4. How Does This Tool Help?
**Memory Design Lab** lets you play with this chalkboard live in your browser:
* **Twist the Knobs**: Change the size of the board ($d$), squeeze in more memories ($N$), or make clues sound almost identical ($\rho$).
* **Watch the Smudge Happen**: See the memory matrix heatmap glow, watch the retrieval error rise, and see the exact algebraic formula showing which memories are leaking into each other!
* **Test Smarter Erasers (The Delta Rule)**: Try an error-correcting eraser that wipes away old mistakes before writing new facts.
* **Stress-Test Real Scenarios**: Switch to **Scenario Mode** to see if an AI coding agent, customer support bot, or smart home sensor will scramble user facts before you ship it to production!

---

## 1. Central Falsifiable Claim

> &ldquo;A fixed-size linear associative memory can process a stream of arbitrary length without allocating a new memory slot for every association, but retrieval error can increase when stored key vectors overlap because other associations contribute cross-talk to the queried memory.&rdquo;

---

## 2. The Two Operational Modes

Memory Design Lab unites deep educational intuition with practical developer utility:

```text
               ┌─────────────────────────────────────────┐
               │           MEMORY DESIGN LAB             │
               └────────────────────┬────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│     MODE 1: EXPLORE THE SCIENCE   │ │ MODE 2: SCENARIO STRESS-TEST LAB  │
│  Tactile, open-ended simulator    │ │  Realistic real-world benchmarks  │
│  for students and researchers.    │ │  for engineers and builders.      │
│                                   │ │                                   │
│  • Dimension (d = 4, 8, 16, 32)   │ │  • AI Coding Agent Context        │
│  • Association Count (N = 1..64)  │ │  • Customer Support Tickets       │
│  • Key Overlap (ρ = 0.0 .. 0.9)   │ │  • Smart IoT Sensor Streams       │
│  • Hebbian vs Delta Update Rule   │ │  • Retrieval Fidelity Indicator   │
│  • Live SVG Matrix Heatmaps       │ │  • Per-Key Cross-Talk Diagnoser   │
│  • Term-by-Term Interference Math │ │  • Suggested Architecture Configs │
└───────────────────────────────────┘ └───────────────────────────────────┘
                                    │
                                    ▼
         ┌─────────────────────────────────────────────────────┐
         │         SHARED PURE-TYPESCRIPT MATH ENGINE          │
         │  Mulberry32 PRNG · 96/96 Automated Unit Tests       │
         │  Exact Hebbian Decomposition: Discrepancy < 10^-16  │
         └─────────────────────────────────────────────────────┘
```

---

## 3. Intended Learner & Prerequisites

- **Target Audience**: Advanced undergraduate students in computer science/data science, machine learning learners, early-career AI researchers, and developers evaluating streaming memory architectures.
- **Prerequisites**:
  - Linear algebra: vector norms, dot products, matrix-vector multiplication, outer products.
  - Probability: basic Gaussian distributions and unit spheres.
  - Familiarity with the key-value-query concept in attention mechanisms.

---

## 4. Core Learning Objectives

After exploring this interactive artifact, a learner should be able to:
1. **Explain a Bounded Associative State**: Contrast $O(1)$ constant-size recurrent memory ($M \in \mathbb{R}^{d \times d}$) with $O(N)$ uncompressed key-value caching.
2. **Understand Memory Writes**: Describe how key/value associations $(k_t, v_t)$ are written via rank-1 updates.
3. **Analyze Cross-Talk**: Prove why non-orthogonal stored keys leak energy into queries, yielding retrieval cross-talk $\sum_{i \neq j} v_i (k_i^\top k_j)$.
4. **Evaluate Retrieval Error**: Distinguish cosine directional fidelity from normalized mean squared error (MSE).
5. **Differentiate Update Rules**: Contrast unconditional additive Hebbian superposition with error-correcting Delta updates.
6. **Connect to Published Research (The BDH Lens)**: Relate fast-weight outer products to dynamic synaptic plasticity in Dragon Hatchling (BDH) and recurrent latent reasoning in BDH-CQ.
7. **Identify Model Boundaries**: State clearly what this educational toy isolates versus what production foundation models require.

---

## 5. System Architecture & Data Flow

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
 │  • ScenarioMode: Real-world practical stress-test benches  │
 │  • LearningChallenge: 3-phase interactive prediction drill │
 └────────────────────────────────────────────────────────────┘
```

---

## 6. Evidence Discipline & Provenance

To maintain total scientific transparency, information across the interface is categorized strictly into three tiers:

| Tier | Category | Scope in this Project | Source / Basis |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **LIVE COMPUTATION** | All memory states $M$, retrieved vectors $\hat{v}$, element-wise error vectors, cosine metrics, MSE errors, and sweep curves. | Pure TypeScript math engine running deterministically in the client browser. |
| **Tier 2** | **EDUCATIONAL ABSTRACTION** | Simplified outer-product memory simulator, exact KV reference baseline, and conceptual toy-to-BDH mapping. | Pedagogical models designed to isolate mathematical mechanisms cleanly. |
| **Tier 3** | **PUBLISHED RESEARCH** | Scale-free particle network, synaptic plasticity, sparse positive activations in BDH, and recurrent latent reasoning in BDH-CQ. | Direct arXiv primary papers: Kosowski et al. (2025), Engdahl et al. (2026), Sun et al. (2023), Yang et al. (2023, 2024). |

---

## 7. Mathematical Foundations

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

## 8. Primary Literature Roles

The primary research papers cited in this project fulfill distinct scientific roles (detailed in [`SOURCES.md`](./SOURCES.md)):
1. **Our Educational Toy**: Directly demonstrates that linear associative memory trades bounded state growth for cross-talk interference under key overlap.
2. **RetNet / GLA / DeltaNet / Gated DeltaNet**: Demonstrate that constant-size recurrent memory, error-correcting delta updates, and gated associative recall are active, competitive modern sequence-modeling paradigms:
   - **RetNet**: [arXiv:2307.08621](https://arxiv.org/abs/2307.08621) (Sun et al., 2023)
   - **GLA**: [arXiv:2312.06635](https://arxiv.org/abs/2312.06635) (Yang et al., 2023)
   - **DeltaNet**: [arXiv:2406.06484](https://arxiv.org/abs/2406.06484) (Yang, Wang, Zhang, Shen, Kim, 2024)
   - **Gated DeltaNet**: [arXiv:2412.06464](https://arxiv.org/abs/2412.06464) (Yang, Kautz, Hatamizadeh, 2024 / ICLR 2025)
3. **Dragon Hatchling (BDH)**: Provides the required neuromorphic anchor (*The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*, Kosowski et al., Sept 30, 2025), showing how inference-time working memory can be implemented via dynamic synaptic plasticity and sparse Hebbian learning in a scale-free particle network ([arXiv:2509.26507](https://arxiv.org/abs/2509.26507)).
4. **BDH-CQ**: Extends the synaptic memory concept to continuous recurrent inference updates and iterative problem-solving in latent space ([arXiv:2608.09888](https://arxiv.org/abs/2608.09888)).

---

## 9. Explicit Scientific Boundaries

1. **Toy Model Disclaimer**: **Does this simulator become BDH?** It does not. The simulator is an educational associative-memory abstraction. BDH is used as a published architectural case study involving dynamic synaptic memory and Hebbian plasticity. It is not an implementation of a production language model, BDH, or BDH-CQ.
2. **No Capacity Universal Threshold**: The project does not claim $N \leq d$ guarantees error-free retrieval or that $N = d$ is a universal failure cliff. Key geometry and overlap dictate error.
3. **Sparsity Does Not Automatically Solve Cross-Talk**: While BDH utilizes sparse positive activations, sparsity in an unconstrained linear outer-product memory does not eliminate interference.
4. **Delta Reduces But Does Not Eliminate Interference**: The Delta update corrects toward target values, but interference persists in a fixed-size state when key vectors overlap.
5. **No Universal Monotonic Law**: Retrieval error curves reflect observed behavior in seeded experiments; fluctuations can occur due to random vector geometry.
6. **No BDH-CQ Claim**: The toy does not reproduce latent reasoning, and our retrieval metrics do not benchmark BDH-CQ.
7. **Toy-Model Design Heuristics**: Diagnostic recommendations in Scenario Mode are flagged explicitly as toy-model design heuristics, not universal deployment guarantees.

---

## 10. Local Setup & Reproducibility

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+

### Commands
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run the full automated test suite (96 passing tests across 11 suites)
npm test

# 3. Verify strict TypeScript compilation (0 errors)
npx tsc --noEmit

# 4. Build optimized production bundle (Turbopack static prerender)
npm run build

# 5. Start production server locally
npm run start

# 6. Run development server with hot-reloading
npm run dev
```

Visit `http://localhost:3000` to interact with the live artifact.

---

## 11. Repository File Structure

```text
├── __tests__/                     # Vitest test suites (96/96 passing across 11 suites)
│   ├── associativeMemory.test.ts  # Memory writing & retrieval tests
│   ├── components.test.ts         # Component render & content tests
│   ├── crossTalk.test.ts          # Cross-talk exact decomposition tests
│   ├── evidence_generation.test.ts# Acceptance test runner & numerical recorder
│   ├── exactKVReference.test.ts   # Explicit KV reference baseline tests
│   ├── experiments.test.ts        # Determinism & causal prefix sweep tests
│   ├── generators.test.ts         # Key/value generation & correlation tests
│   ├── metrics.test.ts            # Cosine similarity & MSE error tests
│   ├── random.test.ts             # Mulberry32 PRNG & Gaussian normality tests
│   ├── scenarios.test.ts          # AI Agent, Customer Support, IoT scenario tests
│   └── vector.test.ts             # Linear algebra primitives tests
├── src/
│   ├── app/
│   │   ├── globals.css            # Dark technical aesthetic & KaTeX styling
│   │   ├── layout.tsx             # Root layout with Geist font
│   │   └── page.tsx               # Main dual-mode educational experience assembly
│   ├── components/                # 14 modular React components
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
│   │   ├── ScenarioMode.tsx       # Practical real-world stress-testing lab
│   │   ├── Sources.tsx            # Verified primary literature section
│   │   └── UpdateRuleComparison.tsx# Hebbian vs Delta identical-data comparison
│   ├── hooks/
│   │   └── useExperiment.ts       # Reactive experiment state & fair comparison hook
│   └── lib/                       # Pure TypeScript mathematical engine
│       ├── associativeMemory.ts   # Hebbian & Delta update formulations
│       ├── crossTalk.ts           # Exact cross-talk decomposition
│       ├── exactKVReference.ts    # Uncompressed KV store baseline
│       ├── experiments.ts         # Experiment runner & causal prefix sweeps
│       ├── generators.ts          # Sqrt(ρ) key generation & mean overlap
│       ├── metrics.ts             # Cosine & MSE quality metrics
│       ├── random.ts              # Seeded Mulberry32 PRNG + Box-Muller
│       ├── scenarios.ts           # Synthetic streaming scenarios & degradation heuristics
│       └── vector.ts              # Vector & matrix arithmetic primitives
├── AI_DISCLOSURE.md               # Human oversight & AI assistance disclosure
├── EVIDENCE.md                    # Measured numerical acceptance test records
├── FINAL_JUDGE_AUDIT.md           # Hostile judge audit with defense strategies
├── LICENSE                        # MIT Open Source License
├── Memory_Under_Pressure_Concept_Summary.pdf # 1-page submission concept PDF
├── QA_REPORT.md                   # Comprehensive browser QA report across 7 viewports
├── SOURCES.md                     # Verified primary research literature records
├── package.json                   # Project dependencies & scripts (includes npm test)
├── package-lock.json              # Exact dependency lockfile for reproducible installs
├── tsconfig.json                  # Strict TypeScript configuration
└── vitest.config.ts               # Vitest test configuration
```
