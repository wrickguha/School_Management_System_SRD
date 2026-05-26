import React from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface MiniChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar';
  height?: number;
  color?: string;
  gridLines?: boolean;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  type = 'line',
  height = 150,
  color = 'var(--accent-primary)',
  gridLines = true,
}) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1) * 1.1; // Add 10% padding on top
  const padding = 20;
  const chartHeight = height - padding * 2;
  const chartWidth = 500; // Fixed relative SVG coordinate width, scaled responsively

  // Generate SVG coordinates
  const points = data.map((d, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1 || 1);
    const y = height - padding - (d.value / maxVal) * chartHeight;
    return { x, y, label: d.label, val: d.value };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Fill path for area charts
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
    : '';

  return (
    <div style={{ width: '100%' }}>
      <svg 
        viewBox={`0 0 ${chartWidth} ${height}`} 
        width="100%" 
        height={height}
        style={{ overflow: 'visible' }}
      >
        {/* Grid Lines */}
        {gridLines && (
          <>
            <line x1={padding} y1={height - padding} x2={chartWidth - padding} y2={height - padding} stroke="var(--border-color)" strokeWidth="1" />
            <line x1={padding} y1={height - padding - chartHeight / 2} x2={chartWidth - padding} y2={height - padding - chartHeight / 2} stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1={padding} y1={height - padding - chartHeight} x2={chartWidth - padding} y2={height - padding - chartHeight} stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
          </>
        )}

        {type === 'line' ? (
          <>
            {/* Area Fill */}
            <path d={areaD} fill={`url(#gradient-${type})`} opacity="0.15" />
            
            {/* Line Path */}
            <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Points & Tooltip indicators */}
            {points.map((p, idx) => (
              <g key={idx} className="chart-dot-group">
                <circle cx={p.x} cy={p.y} r="5" fill="var(--bg-secondary)" stroke={color} strokeWidth="2.5" />
                <circle cx={p.x} cy={p.y} r="8" fill={color} opacity="0" className="hover-pulse" />
                {/* Value tooltip label on top of dot */}
                <text 
                  x={p.x} 
                  y={p.y - 10} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fontWeight="700" 
                  fill="var(--text-primary)" 
                  className="dot-value"
                >
                  {p.val}
                </text>
              </g>
            ))}
          </>
        ) : (
          // Bar Chart
          points.map((p, idx) => {
            const barWidth = Math.min((chartWidth - padding * 2) / data.length * 0.6, 25);
            const x = p.x - barWidth / 2;
            const y = p.y;
            const barHeight = height - padding - y;
            
            return (
              <g key={idx}>
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={barHeight} 
                  rx="3"
                  fill={color} 
                  opacity="0.85" 
                  className="chart-bar"
                />
                <text 
                  x={p.x} 
                  y={p.y - 6} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fontWeight="700" 
                  fill="var(--text-primary)"
                >
                  {p.val}
                </text>
              </g>
            );
          })
        )}

        {/* X Axis Labels */}
        {points.map((p, idx) => {
          // Display only alternate or first/last if too many data points
          const shouldShow = data.length <= 7 || idx % 2 === 0 || idx === data.length - 1;
          if (!shouldShow) return null;
          
          return (
            <text 
              key={idx} 
              x={p.x} 
              y={height - 4} 
              textAnchor="middle" 
              fontSize="10" 
              fontWeight="600" 
              fill="var(--text-tertiary)"
            >
              {p.label}
            </text>
          );
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id={`gradient-line`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        .chart-dot-group:hover .hover-pulse {
          opacity: 0.3;
          r: 12px;
          transition: all 0.25s ease;
        }
        .chart-dot-group .dot-value {
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .chart-dot-group:hover .dot-value {
          opacity: 1;
        }
        .chart-bar {
          transition: opacity var(--transition-fast), fill var(--transition-fast);
        }
        .chart-bar:hover {
          opacity: 1;
          fill: var(--accent-secondary);
        }
      `}</style>
    </div>
  );
};
