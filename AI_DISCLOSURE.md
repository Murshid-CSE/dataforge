# AI Assistance Disclosure

**Project**: Memory Under Pressure  
**Track**: Pathway Track (DataForge 2026 × Rime Hackathon)  
**Topic**: Associative Memory and Fast Weights  

---

## 1. Overview of AI Tool Usage

In accordance with the hackathon rules and integrity guidelines, this project utilized AI coding assistants (including Antigravity / Gemini) to assist with several phases of development:

1. **Code Generation & Scaffolding**: Initial TypeScript module skeletons for vector operations, pseudorandom number generators, and Next.js / Tailwind UI components.
2. **Code Refactoring & Optimization**: Refactoring mathematical functions into pure functional modules and standardizing UI component prop interfaces.
3. **Test Suite Generation**: Drafting initial unit tests in Vitest for vector arithmetic, PRNG distributions, and component render assertions.
4. **Documentation Drafting**: Assisting in structuring and formatting Markdown documentation, evidence tables, and literature summaries.
5. **Research Retrieval Assistance**: Assisting in querying primary literature metadata (arXiv IDs, titles, publication dates).

---

## 2. Human Review & Engineering Verification

**No AI-generated code or text was accepted without rigorous human review and formal automated verification.** The human engineering team independently conducted:

- **Mathematical Proof & Verification**: Independently verified that the Hebbian cross-talk decomposition $\hat{v}_j = v_j + \sum_{i \neq j} v_i (k_i^\top k_j)$ is exact under unit keys, and ensured that this additive decomposition is strictly *not* attributed to the non-linear Delta rule.
- **Formulation Correction**: Specifically corrected the key-correlation generator formula from naive linear mixing to the normalized shared-direction formulation:
  $$k_i = \text{normalize}\left(\sqrt{\rho} \cdot s + \sqrt{1 - \rho} \cdot r_i\right)$$
  ensuring $\rho$ behaves as an interpretable expected overlap control parameter.
- **Fair Experimental Controls**: Enforced that update-rule comparisons (Hebbian vs. Delta) reuse identical PRNG seeds and identical key/value sets, eliminating confounding variables.
- **Primary Source Claim Auditing**: Directly reviewed the primary papers on arXiv for Dragon Hatchling (Kosowski et al., 2025, arXiv:2509.26507) and BDH-CQ (Engdahl et al., 2026, arXiv:2608.09888) to verify all cited architectural properties and prevent hallucinated claims.
- **Automated Verification**: Established an 88-test automated Vitest test suite and strict TypeScript compilation (`tsc --noEmit`) to verify numerical exactness and system determinism.

---

## 3. Scientific Integrity Affirmation

All empirical numerical findings in [`EVIDENCE.md`](./EVIDENCE.md) were computed directly by running deterministic TypeScript code within this repository. No synthetic, hallucinated, or unverified numerical data exists in this project.
