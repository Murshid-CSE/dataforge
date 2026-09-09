const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const katex = require('katex');

function renderMath(tex, displayMode = false) {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
  });
}

// 1. Equations rendered via KaTeX
const eqState = renderMath('k_t, v_t \\in \\mathbb{R}^d, \\quad M_t \\in \\mathbb{R}^{d \\times d}', false);
const eqHebbian = renderMath('M_t = M_{t-1} + v_t k_t^\\top', false);
const eqRetrieval = renderMath('\\hat{v} = M_t q', false);
const eqDecomposition = renderMath('\\hat{v}_j = M k_j = v_j + \\sum_{i \\neq j} v_i (k_i^\\top k_j)', true);
const eqKeyNorm = renderMath('k_i = \\text{normalize}(\\sqrt{\\rho}\\,s + \\sqrt{1-\\rho}\\,r_i)', false);

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Memory Design Lab — Technical Concept Summary</title>
  <style>
    @page {
      size: letter portrait;
      margin: 0.32in 0.36in 0.30in 0.36in;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.2pt;
      line-height: 1.30;
      color: #0f172a;
      background: #ffffff;
      max-height: 10.35in;
      overflow: hidden;
    }
    h1 {
      font-size: 13.5pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.1;
    }
    .header-sub {
      font-size: 8.2pt;
      font-weight: 600;
      color: #2563eb;
      margin-top: 1px;
    }
    .meta-bar {
      font-size: 6.8pt;
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      margin-top: 2px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #0f172a;
      display: flex;
      justify-content: space-between;
    }
    .claim-box {
      margin-top: 4px;
      margin-bottom: 5px;
      padding: 4px 7px;
      background: #f8fafc;
      border-left: 3px solid #2563eb;
      border-radius: 2px;
      font-size: 7.7pt;
      line-height: 1.25;
      font-style: italic;
      color: #1e293b;
    }
    .claim-label {
      font-style: normal;
      font-weight: 700;
      font-size: 6.5pt;
      text-transform: uppercase;
      color: #2563eb;
      font-family: ui-monospace, SFMono-Regular, monospace;
      display: block;
      margin-bottom: 1px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 8px;
      row-gap: 4px;
    }
    .section-title {
      font-size: 7.8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 1px;
      margin-bottom: 2px;
      margin-top: 2px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .section-num {
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 6.8pt;
      color: #2563eb;
    }
    p {
      margin-bottom: 3px;
      text-align: justify;
      hyphens: auto;
    }
    p:last-child {
      margin-bottom: 0;
    }
    strong {
      color: #0f172a;
    }
    .katex {
      font-size: 0.95em !important;
    }
    .math-block {
      text-align: center;
      margin: 2px 0;
      padding: 2px 0;
      background: #f8fafc;
      border-radius: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 6.8pt;
      margin: 2px 0;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 2px 4px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }
    .citation {
      color: #2563eb;
      text-decoration: none;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 6.8pt;
    }
    .badge {
      display: inline-block;
      font-size: 6.2pt;
      font-family: ui-monospace, monospace;
      padding: 0 3px;
      border-radius: 2px;
      background: #e2e8f0;
      color: #334155;
      margin-right: 2px;
    }
    .badge-claim {
      background: #dbeafe;
      color: #1e40af;
      font-weight: 600;
    }
    .callout {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-left: 2.5px solid #d97706;
      padding: 2.5px 5px;
      font-size: 7.1pt;
      margin-top: 2px;
      border-radius: 2px;
    }
    .references {
      font-size: 6.4pt;
      color: #475569;
      line-height: 1.2;
    }
  </style>
  <link rel="stylesheet" href="file:///${path.resolve(__dirname, '../node_modules/katex/dist/katex.min.css').replace(/\\\\/g, '/')}">
</head>
<body>

  <!-- HEADER -->
  <header>
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h1>MEMORY DESIGN LAB</h1>
      <span style="font-size: 7.2pt; font-family: ui-monospace, monospace; font-weight: 700; color: #475569;">TECHNICAL CONCEPT SUMMARY · DATAFORGE 2026</span>
    </div>
    <div class="header-sub">Memory Under Pressure: How Fixed-State Associative Memory Trades Memory Growth for Interference</div>
    <div class="meta-bar">
      <span>TOPIC: Associative Memory &amp; Fast Weights · TRACK: Pathway Track</span>
      <span>SUBMISSION BRIEFING · DETERMINISTIC RESEARCH ARTIFACT</span>
    </div>
  </header>

  <!-- CENTRAL FALSIFIABLE CLAIM -->
  <div class="claim-box">
    <span class="claim-label">Central Falsifiable Scientific Claim</span>
    &ldquo;A fixed-size linear associative memory can process a stream of arbitrary length without allocating a new memory slot for every association, but retrieval error can increase when stored key vectors overlap because other associations contribute cross-talk to the queried memory.&rdquo;
  </div>

  <div class="grid-2">
    <!-- LEFT COLUMN -->
    <div>
      <!-- SECTION 1 -->
      <div class="section-title">
        <span>1. The Real Engineering Problem</span>
        <span class="section-num">01</span>
      </div>
      <p>
        Modern streaming agents process unbounded information (preferences, sensor feeds, customer states), yet cannot retain unbounded history in explicit representations. Standard Transformers maintain explicit key-value caches that grow linearly \(O(N)\) with sequence length, creating prohibitive latency and footprint. Conversely, bounded associative memories compress arbitrary streams into a fixed-capacity matrix state (\(M \\in \\mathbb{R}^{d \\times d}\), \(O(1)\) inference cost). This compression changes the engineering challenge: <strong>a bounded state does not eliminate memory degradation; it trades memory state growth for retrieval interference</strong>.
      </p>

      <!-- SECTION 2 -->
      <div class="section-title">
        <span>2. The Mathematical Mechanism</span>
        <span class="section-num">02</span>
      </div>
      <p>
        Consider unit-normalized key cues \(k_t \\in \\mathbb{R}^d\) (\(\\|k_t\\|=1\)), values \(v_t \\in \\mathbb{R}^d\), and associative state \(M_t \\in \\mathbb{R}^{d \\times d}\). The baseline additive Hebbian write updates memory via rank-1 outer products: \(M_t = M_{t-1} + v_t k_t^\\top\). Querying memory with \(q = k_j\) yields linear retrieval \(\\hat{v}_j = M_t k_j\). Expanding across \(N\) stored associations produces the exact additive decomposition:
      </p>
      <div class="math-block">
        ${eqDecomposition}
      </div>
      <p>
        <strong>Decomposition Insight:</strong> The first term is the isolated target memory. The second term is cross-talk: energy contributed by every other stored memory whose key has non-zero projection (\(k_i^\\top k_j \\neq 0\)) onto the query. Cross-talk is driven by cue geometry, not simply stream duration.
      </p>

      <!-- SECTION 3 -->
      <div class="section-title">
        <span>3. Interactive Substrate: Memory Design Lab</span>
        <span class="section-num">03</span>
      </div>
      <p>
        To make this failure mode tangible, we engineered <em>Memory Design Lab</em>, an interactive client-side web application operating without cloud or backend dependencies. It provides two operational modes:
      </p>
      <p>
        <strong>Mode 1 (Explore the Science):</strong> Learners adjust state dimension \(d \\in \\{4,8,16,32\\}\), association count \(N \\in [1,64]\), correlation parameter \(\\rho \\in [0, 0.9]\) via ${eqKeyNorm}, and rule (Hebbian vs. Delta). Computes live SVG heatmaps, error sweeps, and exact KV baselines in browser.
      </p>
      <p>
        <strong>Mode 2 (Scenario Stress-Test Lab):</strong> Engineers test bounded memory on realistic synthetic tasks (AI Coding Agent Context, Customer Support Tickets, IoT Sensor Stream) to observe which specific facts survive cross-talk before shipping.
      </p>

      <!-- SECTION 4 -->
      <div class="section-title">
        <span>4. Measured Experimental Evidence</span>
        <span class="section-num">04</span>
      </div>
      <p>
        All metrics are evaluated live via a seeded Mulberry32 PRNG (tested in 95 automated unit tests):
      </p>
      <div style="margin: 2px 0;">
        <table>
          <thead>
            <tr>
              <th>Condition</th>
              <th>Config \(\\rho\)</th>
              <th>Mean Overlap</th>
              <th>Mean Cosine</th>
              <th>Retrieval MSE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Low Overlap</strong></td>
              <td>0.10</td>
              <td>0.2690</td>
              <td>0.6783</td>
              <td>0.1563</td>
            </tr>
            <tr>
              <td><strong>High Overlap</strong></td>
              <td>0.80</td>
              <td>0.8031</td>
              <td>0.3607</td>
              <td><strong>1.0890</strong></td>
            </tr>
            <tr>
              <td><strong>Intervention</strong></td>
              <td>+0.70</td>
              <td>+0.5341</td>
              <td>-0.3176</td>
              <td><strong>+0.9327 (6.97×)</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Direct Empirical Validation:</strong> Holding seed (42), state dimension (\(d=8\)), association count (\(N=12\)), values, and update rule identical, increasing key overlap produced a <strong>6.97× increase in measured retrieval MSE</strong>. <em>(Observed in this seeded experiment; not a universal law.)</em> In a fixed \(8 \\times 8\) capacity sweep, scaling \(N=2 \\to 64\) drove MSE from 0.0075 to 1.5896 (&gt;210×), demonstrating capacity pressure in a fixed state.
      </p>
    </div>

    <!-- RIGHT COLUMN -->
    <div>
      <!-- SECTION 5 -->
      <div class="section-title">
        <span>5. Modern Research Context</span>
        <span class="section-num">05</span>
      </div>
      <p>
        This toy system isolates the core design pressure of modern sequence models:
        <strong>RetNet</strong> <a class="citation" href="https://arxiv.org/abs/2307.08621">[arXiv:2307.08621]</a> derives recurrence-attention duals with \(O(1)\) inference memory;
        <strong>GLA</strong> <a class="citation" href="https://arxiv.org/abs/2312.06635">[arXiv:2312.06635]</a> utilizes data-dependent decay gates over matrix-valued states; and
        <strong>Gated DeltaNet</strong> <a class="citation" href="https://arxiv.org/abs/2406.06484">[arXiv:2406.06484]</a> combines gating with delta error-correction updates (\(\\Delta M = \\beta(v_t - M_{t-1}k_t)k_t^\\top\)) to selectively erase stale memory.
      </p>

      <!-- SECTION 6 -->
      <div class="section-title">
        <span>6. The Dragon Hatchling (BDH) Anchor</span>
        <span class="section-num">06</span>
      </div>
      <p>
        BDH (<a class="citation" href="https://arxiv.org/abs/2509.26507">arXiv:2509.26507</a>, <em>The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain</em>, Kosowski et al., Sept 30, 2025) provides the architectural anchor for inference-time working memory:
      </p>
      <p>
        1. <strong>Synaptic Plasticity:</strong> BDH implements working memory during inference via synaptic plasticity and local Hebbian learning (\(\\Delta \\text{synapse}_{ij} \\propto \\text{pre}_j \\times \\text{post}_i\)), dynamically strengthening synapses as concepts are processed.<br>
        2. <strong>Sparse Positive State:</strong> Activations are strictly non-negative and highly sparse, unlike dense unconstrained outer-product memories.<br>
        3. <strong>Educational Boundary:</strong> Our matrix memory is an <em>educational toy abstraction</em>, not an implementation of BDH. While our simulator uses dense matrix multiplication, BDH operates over a scale-free particle graph. The mechanisms are conceptually related but architecturally distinct.
      </p>

      <!-- SECTION 7 -->
      <div class="section-title">
        <span>7. The BDH-CQ Reasoning Bridge</span>
        <span class="section-num">07</span>
      </div>
      <p>
        <strong>BDH-CQ</strong> <a class="citation" href="https://arxiv.org/abs/2608.09888">[arXiv:2608.09888]</a> extends the synaptic family by maintaining continuous recurrent working memory during inference, followed by iterative multi-step reasoning in a latent state space without verbalizing chain-of-thought tokens.
      </p>

      <!-- SECTION 8 -->
      <div class="section-title">
        <span>8. Architectural Trade-Offs</span>
        <span class="section-num">08</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Approach</th>
            <th>Memory State</th>
            <th>Primary Advantage</th>
            <th>Core Trade-off</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Exact KV Store</strong></td>
            <td>List \(\\{(k_i, v_i)\\}\)</td>
            <td>Zero retrieval error</td>
            <td>State scales \(O(N)\)</td>
          </tr>
          <tr>
            <td><strong>Additive State</strong></td>
            <td>Matrix \(M \\in \\mathbb{R}^{d \\times d}\)</td>
            <td>Bounded \(O(1)\) state</td>
            <td>Cross-talk interference</td>
          </tr>
          <tr>
            <td><strong>Delta Update</strong></td>
            <td>Corrected matrix</td>
            <td>Corrects recent cues</td>
            <td>Complex dynamics</td>
          </tr>
          <tr>
            <td><strong>BDH Synaptic</strong></td>
            <td>Particle synapses</td>
            <td>Native working memory</td>
            <td>Specialized graph runtime</td>
          </tr>
        </tbody>
      </table>

      <!-- SECTION 9 -->
      <div class="section-title">
        <span>9. Scientific Boundaries &amp; Open Questions</span>
        <span class="section-num">09</span>
      </div>
      <p>
        <strong>Honest Boundary:</strong> This experiment uses synthetic vectors and a minimal linear outer-product mechanism. It models the behavior of this specified toy system, not the full capability of scaled recurrent language models.
      </p>
      <div class="callout">
        <strong>Open Research Question:</strong> How effectively can richer update rules, data-dependent decay gating, activation sparsity, and learned representation geometry preserve working memory in bounded state without introducing unacceptable cross-talk?
      </div>

      <!-- SECTION 10 -->
      <div class="section-title" style="margin-top: 3px;">
        <span>10. Primary Literature References</span>
        <span class="section-num">10</span>
      </div>
      <div class="references">
        <strong>[1] BDH:</strong> Kosowski et al., <em>Dragon Hatchling</em>, <a class="citation" href="https://arxiv.org/abs/2509.26507">arXiv:2509.26507</a> (2025).<br>
        <strong>[2] BDH-CQ:</strong> Engdahl et al., <em>Recurrent Latent Reasoning</em>, <a class="citation" href="https://arxiv.org/abs/2608.09888">arXiv:2608.09888</a> (2026).<br>
        <strong>[3] RetNet:</strong> Sun et al., <em>Retentive Networks</em>, <a class="citation" href="https://arxiv.org/abs/2307.08621">arXiv:2307.08621</a> (2023).<br>
        <strong>[4] GLA:</strong> Yang et al., <em>Gated Linear Attention</em>, <a class="citation" href="https://arxiv.org/abs/2312.06635">arXiv:2312.06635</a> (2023).<br>
        <strong>[5] Gated DeltaNet:</strong> Yang et al., <em>Delta Rule Transformers</em>, <a class="citation" href="https://arxiv.org/abs/2406.06484">arXiv:2406.06484</a> (2024).
      </div>
    </div>
  </div>

</body>
</html>`;

const outputPath = path.resolve(__dirname, '../public/concept_summary.html');
fs.writeFileSync(outputPath, htmlContent, 'utf-8');
console.log('Generated concept summary HTML at:', outputPath);

// Calculate text-only word count (excluding HTML tags)
const textContent = htmlContent
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const words = textContent.split(' ').filter((w) => w.length > 0);
console.log('Total document word count:', words.length);

// Generate PDF via Microsoft Edge Headless
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const pdfOutputPath = path.resolve(__dirname, '../Memory_Under_Pressure_Concept_Summary.pdf');
const htmlUri = 'file:///' + outputPath.replace(/\\/g, '/');

const edgeCmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfOutputPath}" "${htmlUri}"`;

console.log('Running Edge headless print command...');
execSync(edgeCmd);

console.log('Successfully generated PDF at:', pdfOutputPath);
