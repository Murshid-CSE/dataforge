# Primary Research Literature & Sources

**Project**: Memory Under Pressure  
**Topic**: Associative Memory and Fast Weights  

---

## 1. Architectural Roles of Primary Literature

The six primary research papers cited in this project do not serve as interchangeable &ldquo;proofs&rdquo; of our central claim. Rather, they fulfill distinct scientific roles:

```text
               OUR EDUCATIONAL TOY
                        ↓
     Demonstrates the central claim directly:
     Fixed-state associative memory processes streams
     without state growth, but key overlap induces cross-talk.
                        |
       ┌────────────────┼────────────────┐
       ↓                                 ↓
[BROADER ARCHITECTURAL CONTEXT]    [PATHWAY ARCHITECTURAL ANCHOR]
  RetNet / GLA / DeltaNet /                      BDH
  Gated DeltaNet                                 ↓
       ↓                           Grounds dynamic synaptic
Show bounded/recurrent associative working memory & Hebbian updates.
memory is an active modern paradigm.             ↓
                                                 ↓
                                              BDH-CQ
                                                 ↓
                                         Extends to recurrent
                                         inference-time latent reasoning.
```

---

## 2. Verified Primary Sources

### 1. The Dragon Hatchling (BDH)
- **Full Title**: *The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain*
- **Authors**: Adrian Kosowski, Przemysław Uznański, Jan Chorowski, Zuzanna Stamirowska, Michał Bartoszkiewicz
- **Date**: September 30, 2025
- **Primary Source Link**: [arXiv:2509.26507](https://arxiv.org/abs/2509.26507)
- **Exact Role in this Project**:
  - Grounds the **Pathway-specific architectural connection** by demonstrating a published foundation model whose inference-time working memory operates via synaptic plasticity and local Hebbian learning.
- **Specific Claims Supported**:
  - Inference-time working memory can be formed by dynamically strengthening synapses during inference.
  - Activations are non-negative, sparse, and localized within a scale-free particle graph.
  - BDH has both a graph representation and a parallel GPU-friendly matrix formulation.
  - **Explicit Architectural Boundary**: BDH is *not* a Mamba-style selective SSM; it relies on dynamic synaptic state rather than continuous 1D SSM parameterizations.

---

### 2. BDH-CQ
- **Full Title**: *BDH-CQ: Recurrent Inference-Time Latent Reasoning*
- **Authors**: Engdahl et al.
- **Year**: 2026
- **Primary Source Link**: [arXiv:2608.09888](https://arxiv.org/abs/2608.09888)
- **Exact Role in this Project**:
  - Extends the BDH working-memory connection to recurrent inference-time adaptation and multi-step latent reasoning.
- **Specific Claims Supported**:
  - Inference-time inputs and demonstrations continuously update recurrent memory state.
  - Query problem-solving proceeds through iterative computation in a high-dimensional latent space without verbalizing intermediate tokens.

---

### 3. Retentive Network (RetNet)
- **Full Title**: *Retentive Network: A Successor to Transformer for Large Language Models*
- **Authors**: Yutao Sun, Li Dong, Shaohan Huang, Shuming Ma, Yuqing Xia, Jilong Xue, Jianyin Wang, Furu Wei
- **Year**: 2023
- **Primary Source Link**: [arXiv:2307.08621](https://arxiv.org/abs/2307.08621)
- **Exact Role in this Project**:
  - Provides broader modern architectural context for the dual representation between parallel attention training and constant-size recurrent inference.
- **Specific Claims Supported**:
  - An associative memory state can process unbounded sequences with $O(1)$ inference cost per step while maintaining a bounded state matrix.

---

### 4. Gated Linear Attention (GLA)
- **Full Title**: *Gated Linear Attention Transformers with Hardware-Efficient Training*
- **Authors**: Songlin Yang, Bailin Wang, Yikang Shen, Rameswar Panda, Yoon Kim
- **Year**: 2023
- **Primary Source Link**: [arXiv:2312.06635](https://arxiv.org/abs/2312.06635)
- **Exact Role in this Project**:
  - Provides architectural context for matrix-valued recurrent hidden states equipped with data-dependent decay gates.
- **Specific Claims Supported**:
  - Pure linear recurrence suffers from memory interference and capacity bottlenecks; data-dependent gating is essential to control retention and forgetting in bounded memory matrices.

---

### 5. DeltaNet (Parallel Linear Transformers with Delta Rule)
- **Full Title**: *Parallelizing Linear Transformers with the Delta Rule over Sequence Length*
- **Authors**: Songlin Yang, Bailin Wang, Yu Zhang, Yikang Shen, Yoon Kim
- **Year**: 2024
- **Primary Source Link**: [arXiv:2406.06484](https://arxiv.org/abs/2406.06484)
- **Exact Role in this Project**:
  - Delta-rule associative-memory update and hardware-efficient training of DeltaNet. Directly grounds the mathematical formulation and motivation of the **Delta update rule** implemented in our simulator.
- **Specific Claims Supported**:
  - Replacing naive additive superposition ($M_t = M_{t-1} + v_t k_t^\top$) with an error-correcting delta rule ($M_t = M_{t-1} + \beta (v_t - M_{t-1}k_t)k_t^\top$) directly targets recall error and mitigates cross-talk during sequential associative storage.

---

### 6. Gated DeltaNet (Gated Delta Networks)
- **Full Title**: *Gated Delta Networks: Improving Mamba2 with Delta Rule*
- **Authors**: Songlin Yang, Jan Kautz, Ali Hatamizadeh
- **Year**: 2024 (ICLR 2025)
- **Primary Source Link**: [arXiv:2412.06464](https://arxiv.org/abs/2412.06464)
- **Exact Role in this Project**:
  - Gated delta memory updates, adaptive memory control, and improved associative retrieval.
- **Specific Claims Supported**:
  - Unifies data-dependent gating and delta-rule error correction to dynamically regulate retention, selective forgetting, and interference suppression in recurrent associative states.

---

## 3. Literature Boundaries & Discipline

- **No Equivalence Claimed**: We do not claim our toy simulator implements BDH or BDH-CQ. Our simulator is an educational abstraction isolating the linear fast-weight associative mechanism.
- **No Overreaching Generalization**: These six papers demonstrate that bounded associative state and recurrent memory are active, competitive paradigms. They do *not* imply that linear associative memory universally outperforms softmax attention or that interference is completely eliminated.
