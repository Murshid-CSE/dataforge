'use client';

import React, { useMemo, useState } from 'react';

export interface MemoryHeatmapProps {
  matrix: number[][];
  d: number;
  selectedQueryIndex: number;
  onQuerySelect: (index: number) => void;
  N: number;
}

/**
 * Interpolates a diverging color centered at 0:
 * Negative -> Blue (#3b82f6)
 * Zero     -> Dark (#1a1b23)
 * Positive -> Orange (#f97316)
 */
function getHeatmapColor(value: number, maxAbs: number): string {
  if (maxAbs <= 0 || !Number.isFinite(value)) {
    return '#1a1b23';
  }

  const t = Math.max(-1, Math.min(1, value / maxAbs));

  if (t < 0) {
    // -1: #3b82f6 (59, 130, 246) -> 0: #1a1b23 (26, 27, 35)
    const factor = -t; // 0 at t=0, 1 at t=-1
    const r = Math.round(26 + factor * (59 - 26));
    const g = Math.round(27 + factor * (130 - 27));
    const b = Math.round(35 + factor * (246 - 35));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // 0: #1a1b23 (26, 27, 35) -> +1: #f97316 (249, 115, 22)
    const factor = t; // 0 at t=0, 1 at t=1
    const r = Math.round(26 + factor * (249 - 26));
    const g = Math.round(27 + factor * (115 - 27));
    const b = Math.round(35 + factor * (22 - 35));
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export function MemoryHeatmap({
  matrix,
  d,
  selectedQueryIndex,
  onQuerySelect,
  N,
}: MemoryHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
    val: number;
  } | null>(null);

  // Maximum absolute value across the matrix for normalization
  const maxAbs = useMemo(() => {
    let max = 0;
    for (let r = 0; r < matrix.length; r++) {
      const row = matrix[r];
      if (!row) continue;
      for (let c = 0; c < row.length; c++) {
        const absVal = Math.abs(row[c]);
        if (absVal > max) {
          max = absVal;
        }
      }
    }
    return max > 0 ? max : 1.0;
  }, [matrix]);

  // Adaptive cell sizing based on dimension d
  const cellSize = d <= 8 ? 28 : d <= 16 ? 20 : 12;
  const cellGap = d <= 16 ? 1.5 : 1;
  const showLabels = d <= 16;
  const labelOffset = showLabels ? 26 : 0;

  const gridWidth = d * cellSize + Math.max(0, d - 1) * cellGap;
  const gridHeight = d * cellSize + Math.max(0, d - 1) * cellGap;
  const svgWidth = gridWidth + labelOffset;
  const svgHeight = gridHeight + labelOffset;

  return (
    <div className="glass-card rounded-2xl border border-border/80 p-5 sm:p-6 flex flex-col gap-4 shadow-lg">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground tracking-tight flex items-center gap-1.5">
              <span>📋</span> Memory State M
            </h3>
            <span className="text-[10px] font-mono uppercase bg-accent/15 text-accent border border-accent/30 px-2 py-0.5 rounded font-semibold">
              The Chalkboard
            </span>
          </div>
          <p className="text-xs text-muted font-mono mt-0.5">
            (d &times; d = {d} &times; {d} matrix · {d * d} constant float cells)
          </p>
        </div>

        {/* Association selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="heatmap-query-select"
            className="text-xs text-muted font-medium"
          >
            Association:
          </label>
          <select
            id="heatmap-query-select"
            value={selectedQueryIndex}
            onChange={(e) => onQuerySelect(Number(e.target.value))}
            className="bg-surface text-foreground border border-border rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition shadow-sm"
            aria-label="Select target association query"
          >
            {Array.from({ length: Math.max(1, N) }, (_, i) => (
              <option key={i} value={i}>
                Query #{i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chalkboard Metaphor Banner */}
      <div className="bg-surface-2/40 rounded-xl p-2.5 border border-border/60 text-[11px] text-muted flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span>💡</span>
          <span>All <strong>N = {N}</strong> associations are stamped into this exact grid without expanding its size!</span>
        </span>
        <span className="font-mono text-[10px] text-success font-semibold px-2 py-0.5 rounded bg-success/10 border border-success/30">
          O(1) Constant Size
        </span>
      </div>

      {/* Dynamic cell inspector status */}
      <div className="flex items-center justify-between text-xs font-mono bg-surface-2/60 px-3 py-1.5 rounded border border-border/80 text-muted min-h-[30px]">
        {hoveredCell ? (
          <div>
            <span className="text-foreground font-semibold">
              M[{hoveredCell.row}, {hoveredCell.col}]
            </span>
            {' = '}
            <span
              className={
                hoveredCell.val > 0
                  ? 'text-retrieved font-semibold'
                  : hoveredCell.val < 0
                  ? 'text-accent font-semibold'
                  : 'text-foreground'
              }
            >
              {hoveredCell.val >= 0
                ? `+${hoveredCell.val.toFixed(4)}`
                : hoveredCell.val.toFixed(4)}
            </span>
          </div>
        ) : (
          <span className="text-muted/80">
            Hover over a cell to inspect value
          </span>
        )}
        <div>
          <span className="text-muted">max |M|: </span>
          <span className="text-foreground font-semibold">
            {maxAbs.toFixed(4)}
          </span>
        </div>
      </div>

      {/* SVG Heatmap */}
      <div className="flex items-center justify-center overflow-x-auto py-2">
        <svg
          role="img"
          aria-label={`Memory state matrix heatmap of size ${d} by ${d}`}
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="select-none overflow-visible"
        >
          {/* Column labels (top) */}
          {showLabels &&
            Array.from({ length: d }, (_, col) => {
              const x =
                labelOffset + col * (cellSize + cellGap) + cellSize / 2;
              return (
                <text
                  key={`col-label-${col}`}
                  x={x}
                  y={labelOffset - 8}
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                  className="select-none"
                >
                  {col}
                </text>
              );
            })}

          {/* Row labels (left) */}
          {showLabels &&
            Array.from({ length: d }, (_, row) => {
              const y =
                labelOffset + row * (cellSize + cellGap) + cellSize / 2 + 3.5;
              return (
                <text
                  key={`row-label-${row}`}
                  x={labelOffset - 8}
                  y={y}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                  className="select-none"
                >
                  {row}
                </text>
              );
            })}

          {/* Matrix Cells */}
          {matrix.map((rowArr, row) =>
            rowArr.map((val, col) => {
              const x = labelOffset + col * (cellSize + cellGap);
              const y = labelOffset + row * (cellSize + cellGap);
              const fillColor = getHeatmapColor(val, maxAbs);
              const isHovered =
                hoveredCell?.row === row && hoveredCell?.col === col;

              return (
                <rect
                  key={`cell-${row}-${col}`}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={d <= 8 ? 2 : 1}
                  ry={d <= 8 ? 2 : 1}
                  fill={fillColor}
                  stroke={isHovered ? '#ffffff' : '#2e3039'}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredCell({ row, col, val })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <title>{`M[${row}, ${col}] = ${val >= 0 ? '+' : ''}${val.toFixed(4)}`}</title>
                </rect>
              );
            })
          )}
        </svg>
      </div>

      {/* Compact Color Legend */}
      <div className="flex flex-col items-center gap-1.5 pt-2 border-t border-border">
        <div className="flex items-center justify-between w-full max-w-xs text-[11px] font-mono text-muted">
          <span className="text-accent font-medium">
            -{maxAbs.toFixed(2)}
          </span>
          <span className="text-muted">0.00</span>
          <span className="text-retrieved font-medium">
            +{maxAbs.toFixed(2)}
          </span>
        </div>

        <div className="w-full max-w-xs h-2.5 rounded border border-border overflow-hidden bg-gradient-to-r from-[#3b82f6] via-[#1a1b23] to-[#f97316]" />

        <div className="flex items-center justify-between w-full max-w-xs text-[10px] text-muted">
          <span className="text-accent">Negative (-)</span>
          <span className="text-muted">Zero</span>
          <span className="text-retrieved">Positive (+)</span>
        </div>
      </div>
    </div>
  );
}

export default MemoryHeatmap;
