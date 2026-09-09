'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import type { SweepPoint } from '@/lib/experiments';

export interface ErrorChartProps {
  data: SweepPoint[];
  currentN: number;
  d: number;
  rho: number;
  rule: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: SweepPoint;
    value: number;
    dataKey: string;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0 && payload[0].payload) {
    const point = payload[0].payload;
    return (
      <div className="bg-surface-2 border border-border rounded-md px-3 py-2 text-xs shadow-lg space-y-1">
        <p className="font-semibold text-foreground mb-1">
          Associations (N): <span className="font-mono text-foreground">{point.N}</span>
        </p>
        <p className="text-muted flex items-center justify-between gap-4">
          <span className="text-cross-talk font-medium">Retrieval Error (MSE):</span>
          <span className="font-mono text-foreground font-semibold">{point.meanMSE.toFixed(4)}</span>
        </p>
        <p className="text-muted flex items-center justify-between gap-4">
          <span className="text-accent font-medium">Mean Cosine:</span>
          <span className="font-mono text-foreground font-semibold">{point.meanCosine.toFixed(3)}</span>
        </p>
        <p className="text-muted flex items-center justify-between gap-4">
          <span>Mean Key Overlap:</span>
          <span className="font-mono text-foreground">{point.measuredPairwiseCosine.toFixed(3)}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function ErrorChart({
  data,
  currentN,
  d,
  rho,
  rule,
}: ErrorChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [metricView, setMetricView] = useState<'error' | 'both'>('error');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-surface rounded-lg border border-border p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Retrieval Error vs. Number of Associations
          </h3>
          <p className="text-xs text-muted">
            Tracking memory pressure as stored associations accumulate in fixed state (d={d})
          </p>
        </div>

        {/* Metric display toggle */}
        <div className="flex items-center gap-1 bg-surface-2 border border-border rounded-md p-0.5 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetricView('error')}
            className={`px-2.5 py-1 rounded transition font-medium ${
              metricView === 'error'
                ? 'bg-cross-talk/20 text-cross-talk border border-cross-talk/30'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Retrieval Error (MSE)
          </button>
          <button
            type="button"
            onClick={() => setMetricView('both')}
            className={`px-2.5 py-1 rounded transition font-medium ${
              metricView === 'both'
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Error + Cosine
          </button>
        </div>
      </div>

      <div className="w-full h-[300px] bg-transparent">
        {isMounted ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 15, right: metricView === 'both' ? 45 : 20, left: 15, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="N"
                stroke="var(--border)"
                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                tickLine={{ stroke: 'var(--border)' }}
                label={{
                  value: 'Number of stored associations (N)',
                  position: 'insideBottom',
                  offset: -12,
                  fill: 'var(--muted)',
                  fontSize: 12,
                }}
              />
              {/* Primary Y-axis: Normalized Retrieval Error (MSE) */}
              <YAxis
                yAxisId="errorAxis"
                stroke="var(--border)"
                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                tickLine={{ stroke: 'var(--border)' }}
                label={{
                  value: 'Normalized retrieval error (MSE)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 0,
                  fill: 'var(--cross-talk)',
                  fontSize: 11,
                  style: { textAnchor: 'middle' },
                }}
              />

              {/* Secondary Y-axis: Mean Cosine Similarity (when dual view active) */}
              {metricView === 'both' && (
                <YAxis
                  yAxisId="cosineAxis"
                  orientation="right"
                  domain={[0, 1]}
                  stroke="var(--border)"
                  tick={{ fill: 'var(--muted)', fontSize: 11 }}
                  tickLine={{ stroke: 'var(--border)' }}
                  label={{
                    value: 'Mean Cosine Similarity',
                    angle: 90,
                    position: 'insideRight',
                    offset: 10,
                    fill: 'var(--accent)',
                    fontSize: 11,
                    style: { textAnchor: 'middle' },
                  }}
                />
              )}

              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 8, fontSize: 12 }}
              />

              <ReferenceLine
                yAxisId="errorAxis"
                x={currentN}
                stroke="var(--retrieved)"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: `Current N = ${currentN}`,
                  position: 'top',
                  fill: 'var(--retrieved)',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />

              {/* Primary Line: Retrieval Error */}
              <Line
                yAxisId="errorAxis"
                type="monotone"
                dataKey="meanMSE"
                name="Retrieval Error (MSE)"
                stroke="var(--cross-talk)"
                strokeWidth={2.2}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: 'var(--cross-talk)',
                  stroke: 'var(--surface)',
                  strokeWidth: 2,
                }}
              />

              {/* Optional Secondary Line: Mean Cosine Similarity */}
              {metricView === 'both' && (
                <Line
                  yAxisId="cosineAxis"
                  type="monotone"
                  dataKey="meanCosine"
                  name="Mean Cosine Similarity"
                  stroke="var(--accent)"
                  strokeWidth={1.8}
                  strokeDasharray="4 2"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: 'var(--accent)',
                    stroke: 'var(--surface)',
                    strokeWidth: 1.5,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted">
            Loading error chart...
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-muted">
        <span>
          {`Observed in this seeded experiment (d=${d}, ρ=${rho.toFixed(2)}, ${rule}); behavior depends on key geometry and update rule.`}
        </span>
        <span className="text-[11px] font-mono text-muted/80">
          Non-monotonic variation is expected from random unit geometries
        </span>
      </div>
    </div>
  );
}

export default ErrorChart;
