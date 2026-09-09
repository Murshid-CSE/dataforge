import { runExperiment, type ExperimentResult } from './experiments';
import { decomposeCrossTalk } from './crossTalk';
import type { UpdateRule } from './associativeMemory';

export interface ScenarioFact {
  id: string;
  key: string;
  value: string;
  category: string;
  critical?: boolean;
}

export interface ScenarioQuery {
  id: string;
  prompt: string;
  factKey: string;
  factIndex: number;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  domain: 'Agent Memory' | 'Customer Support' | 'IoT / Telemetry';
  defaultD: number;
  defaultN: number;
  defaultRho: number;
  defaultRule: UpdateRule;
  facts: ScenarioFact[];
  queries: ScenarioQuery[];
}

export interface FactStressResult {
  fact: ScenarioFact;
  factIndex: number;
  cosine: number;
  mse: number;
  risk: 'safe' | 'degraded' | 'corrupted';
  statusLabel: string;
  decodedValue: string;
  topInterferingFacts: Array<{
    factKey: string;
    factValue: string;
    overlap: number;
    contributionMagnitude: number;
  }>;
}

export interface ScenarioEvaluation {
  scenario: ScenarioDefinition;
  experimentResult: ExperimentResult;
  d: number;
  N: number;
  rho: number;
  rule: UpdateRule;
  seed: number;
  healthScore: number; // 0 - 100%
  highRiskCount: number;
  degradedCount: number;
  safeCount: number;
  measuredKeyOverlap: number;
  factResults: FactStressResult[];
  mostVulnerable: FactStressResult[];
  recommendation: {
    headline: string;
    details: string;
    suggestedAction?: 'increase_d' | 'use_delta' | 'reduce_rho';
  };
}

export const SCENARIOS: Record<string, ScenarioDefinition> = {
  'ai-agent': {
    id: 'ai-agent',
    name: 'AI Agent Memory',
    tagline: 'User preferences, tool configs, and context in a long-horizon coding agent',
    description:
      'This scenario lets an engineer explore how a bounded associative-memory design behaves on synthetic coding-agent preferences, project constraints, and framework settings without unbounded context growth.',
    domain: 'Agent Memory',
    defaultD: 8,
    defaultN: 16,
    defaultRho: 0.25,
    defaultRule: 'hebbian',
    facts: [
      { id: 'f1', key: 'preferred_language', value: 'Python 3.12', category: 'Language', critical: true },
      { id: 'f2', key: 'web_framework', value: 'Next.js 16', category: 'Framework', critical: true },
      { id: 'f3', key: 'primary_database', value: 'PostgreSQL 16', category: 'Database', critical: true },
      { id: 'f4', key: 'orm_layer', value: 'Prisma Client', category: 'Database' },
      { id: 'f5', key: 'ui_styling', value: 'Tailwind CSS v4', category: 'Frontend' },
      { id: 'f6', key: 'testing_framework', value: 'Vitest', category: 'Testing' },
      { id: 'f7', key: 'auth_protocol', value: 'OAuth 2.0 / JWT', category: 'Security', critical: true },
      { id: 'f8', key: 'cloud_host', value: 'AWS us-east-1', category: 'Infrastructure' },
      { id: 'f9', key: 'container_runtime', value: 'Docker Compose', category: 'Infrastructure' },
      { id: 'f10', key: 'ci_pipeline', value: 'GitHub Actions', category: 'DevOps' },
      { id: 'f11', key: 'cache_store', value: 'Redis Cluster', category: 'Database' },
      { id: 'f12', key: 'search_engine', value: 'Elasticsearch', category: 'Search' },
      { id: 'f13', key: 'api_style', value: 'REST + JSON', category: 'Architecture' },
      { id: 'f14', key: 'rate_limiting', value: '120 req / min', category: 'Security' },
      { id: 'f15', key: 'logging_format', value: 'Structured JSON', category: 'Observability' },
      { id: 'f16', key: 'error_tracker', value: 'Sentry SDK', category: 'Observability' },
      { id: 'f17', key: 'user_timezone', value: 'UTC+05:30 (IST)', category: 'User' },
      { id: 'f18', key: 'user_role', value: 'Lead ML Engineer', category: 'User' },
      { id: 'f19', key: 'code_style', value: 'Concise, functional', category: 'Preferences' },
      { id: 'f20', key: 'backup_cadence', value: 'Daily 02:00 UTC', category: 'Operations' },
      { id: 'f21', key: 'encryption_mode', value: 'AES-256-GCM', category: 'Security' },
      { id: 'f22', key: 'git_main_branch', value: 'production-main', category: 'DevOps' },
      { id: 'f23', key: 'target_latency', value: '< 150 ms (p95)', category: 'Performance' },
      { id: 'f24', key: 'license_tier', value: 'Apache 2.0 Open', category: 'Legal' },
    ],
    queries: [
      { id: 'q1', prompt: 'What programming language is required?', factKey: 'preferred_language', factIndex: 0 },
      { id: 'q2', prompt: 'Which primary database is deployed?', factKey: 'primary_database', factIndex: 2 },
      { id: 'q3', prompt: 'What authentication protocol is enforced?', factKey: 'auth_protocol', factIndex: 6 },
      { id: 'q4', prompt: 'What is the required testing framework?', factKey: 'testing_framework', factIndex: 5 },
      { id: 'q5', prompt: 'What is the target p95 service latency?', factKey: 'target_latency', factIndex: 22 },
    ],
  },
  'customer-support': {
    id: 'customer-support',
    name: 'Customer Support Context',
    tagline: 'Customer status, dispute history, and SLA commitments in live support',
    description:
      'This scenario lets an engineer explore how a bounded associative-memory design behaves on a synthetic customer-support context (maintaining customer history, ticket state, and dispute flags in a fixed state representation).',
    domain: 'Customer Support',
    defaultD: 8,
    defaultN: 16,
    defaultRho: 0.35,
    defaultRule: 'hebbian',
    facts: [
      { id: 'cs1', key: 'customer_plan', value: 'Enterprise Tier 1', category: 'Account', critical: true },
      { id: 'cs2', key: 'account_status', value: 'Active / In Good Standing', category: 'Account' },
      { id: 'cs3', key: 'payment_status', value: 'Payment Failed (Past Due)', category: 'Billing', critical: true },
      { id: 'cs4', key: 'refund_status', value: 'Pending Finance Approval', category: 'Billing', critical: true },
      { id: 'cs5', key: 'last_issue_type', value: 'Invoice Discrepancy', category: 'Dispute' },
      { id: 'cs6', key: 'priority_level', value: 'Urgent / High Priority', category: 'Routing', critical: true },
      { id: 'cs7', key: 'assigned_rep', value: 'Sarah Lin (Tier 2)', category: 'Routing' },
      { id: 'cs8', key: 'customer_tz', value: 'America/New_York (EST)', category: 'Account' },
      { id: 'cs9', key: 'channel_pref', value: 'Encrypted Chat', category: 'Contact' },
      { id: 'cs10', key: 'csat_rating', value: '2.5 / 5.0 (At Risk)', category: 'Quality' },
      { id: 'cs11', key: 'contract_renewal', value: 'November 30, 2026', category: 'Contract' },
      { id: 'cs12', key: 'billing_curr', value: 'USD ($)', category: 'Billing' },
      { id: 'cs13', key: 'active_discount', value: '20% Annual Loyalty', category: 'Billing' },
      { id: 'cs14', key: 'sla_target', value: '15 Minute Escalation', category: 'Routing', critical: true },
      { id: 'cs15', key: 'product_edition', value: 'Streaming API Suite', category: 'Product' },
      { id: 'cs16', key: 'licensed_seats', value: '120 Active Seats', category: 'Product' },
      { id: 'cs17', key: 'mfa_compliance', value: 'Hardware Security Key', category: 'Security' },
      { id: 'cs18', key: 'escalation_tier', value: 'Executive Escalation', category: 'Dispute' },
      { id: 'cs19', key: 'churn_risk_flag', value: 'HIGH_RISK_CHURN', category: 'Account', critical: true },
      { id: 'cs20', key: 'ticket_history', value: '18 Past Inquiries', category: 'Dispute' },
      { id: 'cs21', key: 'annual_revenue', value: '$72,000 ARR', category: 'Contract' },
      { id: 'cs22', key: 'company_domain', value: 'acme-global.corp', category: 'Account' },
      { id: 'cs23', key: 'contract_owner', value: 'VP Operations', category: 'Contract' },
      { id: 'cs24', key: 'support_region', value: 'North America East', category: 'Routing' },
    ],
    queries: [
      { id: 'csq1', prompt: "What is the customer's current refund status?", factKey: 'refund_status', factIndex: 3 },
      { id: 'csq2', prompt: 'What is the current payment status on record?', factKey: 'payment_status', factIndex: 2 },
      { id: 'csq3', prompt: 'What SLA escalation turnaround is promised?', factKey: 'sla_target', factIndex: 13 },
      { id: 'csq4', prompt: 'What churn risk flag is currently active?', factKey: 'churn_risk_flag', factIndex: 18 },
      { id: 'csq5', prompt: 'What subscription plan is the account on?', factKey: 'customer_plan', factIndex: 0 },
    ],
  },
  'sensor-stream': {
    id: 'sensor-stream',
    name: 'IoT Device & Sensor Stream',
    tagline: 'Edge telemetry, threshold alerts, and battery metrics in embedded sensors',
    description:
      'This scenario lets an engineer explore how a bounded associative-memory design behaves on synthetic edge-telemetry measurements and diagnostic alerts in an embedded buffer.',
    domain: 'IoT / Telemetry',
    defaultD: 8,
    defaultN: 16,
    defaultRho: 0.20,
    defaultRule: 'hebbian',
    facts: [
      { id: 'ss1', key: 'device_serial', value: 'Edge-Node-X49B', category: 'Hardware', critical: true },
      { id: 'ss2', key: 'firmware_rev', value: 'v2.4.1-rc2', category: 'Software' },
      { id: 'ss3', key: 'power_mode', value: 'Duty-Cycled Eco', category: 'Power' },
      { id: 'ss4', key: 'battery_state', value: '78% (Healthy)', category: 'Power', critical: true },
      { id: 'ss5', key: 'core_temp_c', value: '42.5 °C (Nominal)', category: 'Telemetry' },
      { id: 'ss6', key: 'vibration_rms', value: '0.042g (Normal)', category: 'Telemetry' },
      { id: 'ss7', key: 'modem_carrier', value: 'LTE-M Band 4', category: 'Network' },
      { id: 'ss8', key: 'signal_rssi', value: '-76 dBm (Good)', category: 'Network' },
      { id: 'ss9', key: 'satellite_fix', value: '3D Fix (8 Sats)', category: 'GPS' },
      { id: 'ss10', key: 'alert_flag', value: 'OVERHEAT_WARNING', category: 'Alarm', critical: true },
      { id: 'ss11', key: 'sampling_rate', value: '100 Hz Continuous', category: 'Config' },
      { id: 'ss12', key: 'buffer_fill', value: '84% Capacity', category: 'Memory' },
      { id: 'ss13', key: 'last_calibrated', value: 'August 15, 2026', category: 'Calibration' },
      { id: 'ss14', key: 'sensor_bus', value: 'Modbus-RTU / RS485', category: 'Hardware' },
      { id: 'ss15', key: 'device_uptime', value: '1,420 Hours', category: 'Telemetry' },
      { id: 'ss16', key: 'flash_wear', value: '12% Consumed', category: 'Memory' },
      { id: 'ss17', key: 'packet_drop', value: '0.08% Transmit Loss', category: 'Network' },
      { id: 'ss18', key: 'humidity_rh', value: '64% Relative', category: 'Telemetry' },
      { id: 'ss19', key: 'rail_voltage', value: '3.31 V Regulated', category: 'Power' },
      { id: 'ss20', key: 'watchdog_timer', value: 'Armed (2000ms)', category: 'Hardware' },
      { id: 'ss21', key: 'secure_enclave', value: 'ATECC608A Verified', category: 'Security' },
      { id: 'ss22', key: 'active_gateway', value: 'gw-east-us-04', category: 'Network' },
      { id: 'ss23', key: 'reboot_reason', value: 'Scheduled OTA Patch', category: 'Software' },
      { id: 'ss24', key: 'sleep_interval', value: '900 ms Deep Sleep', category: 'Power' },
    ],
    queries: [
      { id: 'ssq1', prompt: 'What active alert condition is flagged?', factKey: 'alert_flag', factIndex: 9 },
      { id: 'ssq2', prompt: 'What is the current battery percentage?', factKey: 'battery_state', factIndex: 3 },
      { id: 'ssq3', prompt: 'What cellular carrier is connected?', factKey: 'modem_carrier', factIndex: 6 },
      { id: 'ssq4', prompt: 'What is the telemetry buffer fill level?', factKey: 'buffer_fill', factIndex: 11 },
      { id: 'ssq5', prompt: 'What was the last device reboot cause?', factKey: 'reboot_reason', factIndex: 22 },
    ],
  },
};

/**
 * Runs a deterministic stress test on a structured scenario using the tested associative memory engine.
 */
export function evaluateScenario(
  scenarioId: string,
  d: number,
  N: number,
  rho: number,
  rule: UpdateRule,
  seed: number = 42
): ScenarioEvaluation {
  const scenario = SCENARIOS[scenarioId] ?? SCENARIOS['ai-agent'];
  const clampedN = Math.max(2, Math.min(N, scenario.facts.length));

  // Run the live linear associative experiment
  const expResult = runExperiment({
    seed,
    d,
    N: clampedN,
    rho,
    rule,
    selectedQueryIndex: 0,
  });

  const factResults: FactStressResult[] = [];

  for (let i = 0; i < clampedN; i++) {
    const fact = scenario.facts[i];
    const detail = expResult.queryDetails[i];
    const cosine = detail ? detail.cosine : 0;
    const mse = detail ? detail.mse : 1;

    let risk: 'safe' | 'degraded' | 'corrupted' = 'safe';
    let statusLabel = 'High Retrieval Fidelity';
    let decodedValue = fact.value;

    if (cosine < 0.60) {
      risk = 'corrupted';
      statusLabel = 'High Retrieval Distortion';
      decodedValue = `[HIGH DISTORTION: ~${fact.value.slice(0, 4)}... (Noise MSE: ${mse.toFixed(2)})]`;
    } else if (cosine < 0.82) {
      risk = 'degraded';
      statusLabel = 'Moderate Distortion';
      decodedValue = `${fact.value} [cross-talk noise]`;
    }

    // Identify top cross-talk contributors from other stored facts
    const retrievedVec = detail ? detail.retrieved : expResult.values[i];
    const decomp = decomposeCrossTalk(expResult.keys, expResult.values, i, retrievedVec);
    const otherContributors = decomp.crossTalkTerms
      .filter((t) => t.sourceIndex !== i)
      .slice(0, 3)
      .map((t) => {
        const interferingFact = scenario.facts[t.sourceIndex];
        return {
          factKey: interferingFact ? interferingFact.key : `fact_${t.sourceIndex}`,
          factValue: interferingFact ? interferingFact.value : `value_${t.sourceIndex}`,
          overlap: t.overlap,
          contributionMagnitude: Math.abs(t.overlap),
        };
      });

    factResults.push({
      fact,
      factIndex: i,
      cosine,
      mse,
      risk,
      statusLabel,
      decodedValue,
      topInterferingFacts: otherContributors,
    });
  }

  const safeCount = factResults.filter((f) => f.risk === 'safe').length;
  const degradedCount = factResults.filter((f) => f.risk === 'degraded').length;
  const highRiskCount = factResults.filter((f) => f.risk === 'corrupted').length;

  // Health Score: 0 to 100%
  const meanCosineClamped = Math.max(0, expResult.aggregate.meanCosine);
  const healthScore = Math.round(
    (0.6 * meanCosineClamped + 0.4 * (safeCount / clampedN)) * 100
  );

  // Sort by lowest cosine to identify most vulnerable associations
  const mostVulnerable = [...factResults]
    .sort((a, b) => a.cosine - b.cosine)
    .slice(0, 3);

  // Formulate toy-model diagnostic and suggested experiment (heuristics, not universal laws)
  let headline = 'Toy-Model Diagnostic: Observed Retrieval Stable';
  let details = `In this seeded run with d=${d} and measured key overlap ${expResult.measuredMeanPairwiseCosine.toFixed(3)}, all ${clampedN} facts are retrieved with high directional fidelity in this toy model.`;
  let suggestedAction: 'increase_d' | 'use_delta' | 'reduce_rho' | undefined = undefined;

  if (clampedN > d * 1.5) {
    headline = `Toy-Model Diagnostic: High Compression Ratio (${clampedN} Facts in ${d}×${d} State)`;
    details = `In this specified linear memory, forcing ${clampedN} associations into ${d} dimensions produces cross-talk accumulation. Suggested experiment: Try a larger state dimension (e.g., d=16 or d=32) and compare whether measured retrieval improves in this scenario.`;
    suggestedAction = 'increase_d';
  } else if (rho >= 0.35) {
    headline = `Toy-Model Diagnostic: Significant Key Overlap (Configured ρ=${rho.toFixed(2)}, Measured ${expResult.measuredMeanPairwiseCosine.toFixed(3)})`;
    details = `Stored retrieval cues share strong directional components, causing stored values to leak into queries. Suggested experiment: Try the Delta update rule or reduce cue overlap parameter ρ, and compare whether error correction reduces cross-talk on recent memories.`;
    suggestedAction = rule === 'hebbian' ? 'use_delta' : 'reduce_rho';
  } else if (highRiskCount > 0 && rule === 'hebbian') {
    headline = 'Toy-Model Diagnostic: Additive Hebbian Accumulation Without Error Correction';
    details = `Additive Hebbian updates continually superimpose vectors into state M without correcting for existing contents. Suggested experiment: Try the Delta update rule (with β=1.0) and measure whether error correction reduces retrieval error on recent associations.`;
    suggestedAction = 'use_delta';
  } else if (degradedCount > 0) {
    headline = 'Toy-Model Diagnostic: Moderate Cross-Talk Observed';
    details = `In this seeded run, ${degradedCount} associations exhibit degraded retrieval due to key geometry. Suggested experiment: Try a larger state dimension or lower cue correlation to compare retrieval fidelity.`;
    suggestedAction = 'increase_d';
  }

  return {
    scenario,
    experimentResult: expResult,
    d,
    N: clampedN,
    rho,
    rule,
    seed,
    healthScore,
    highRiskCount,
    degradedCount,
    safeCount,
    measuredKeyOverlap: expResult.measuredMeanPairwiseCosine,
    factResults,
    mostVulnerable,
    recommendation: {
      headline,
      details,
      suggestedAction,
    },
  };
}
