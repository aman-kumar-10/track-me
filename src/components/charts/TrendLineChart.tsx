import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line } from 'react-native-svg';
import { Colors, Layout } from '../../constants/theme';
import { ChartDataPoint } from '../../services/statisticsService';
import { AppCard } from '../common/AppCard';

interface TrendLineChartProps {
  title: string;
  categoryTag: string;
  points: ChartDataPoint[];
  averageValue: number;
  peakValue: number;
  targetValue?: number;
  unit?: string;
  accentColor?: string;
  deltaPercent?: number;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  title,
  categoryTag,
  points,
  averageValue,
  peakValue,
  targetValue,
  unit = '',
  accentColor = Colors.primary,
  deltaPercent,
}) => {
  const chartHeight = 130;
  const chartWidth = 310;
  const paddingX = 16;
  const paddingY = 18;

  const values = points.map((p) => p.value);
  const minVal = Math.min(...values, targetValue ? targetValue - 10 : 0);
  const maxVal = Math.max(...values, peakValue, targetValue || 0);
  const range = maxVal - minVal || 1;

  // Calculate coordinates for points
  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1 || 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((p.value - minVal) / range) * (chartHeight - paddingY * 2);
    return { x, y, ...p };
  });

  // Construct SVG Path
  const linePath = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Construct Area Path for gradient fill
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${chartHeight} L ${coords[0].x} ${chartHeight} Z`;

  // Target line Y coordinate
  const targetY = targetValue
    ? chartHeight - paddingY - ((targetValue - minVal) / range) * (chartHeight - paddingY * 2)
    : null;

  return (
    <AppCard style={styles.card}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.categoryTag}>{categoryTag}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightStats}>
          <View style={styles.avgBadge}>
            <Text style={styles.avgLabel}>AVG</Text>
            <Text style={[styles.avgValue, { color: accentColor }]}>
              {averageValue}{unit}
            </Text>
          </View>
          {deltaPercent !== undefined && (
            <View style={[styles.deltaPill, { backgroundColor: `${Colors.success}1A` }]}>
              <Text style={[styles.deltaText, { color: Colors.success }]}>
                ↑ {deltaPercent}%
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* SVG Chart Area */}
      <View style={styles.svgContainer}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Defs>
            <LinearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={accentColor} stopOpacity="0.28" />
              <Stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Benchmark Target Line */}
          {targetY !== null && (
            <Line
              x1={paddingX}
              y1={targetY}
              x2={chartWidth - paddingX}
              y2={targetY}
              stroke={Colors.textMuted}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )}

          {/* Gradient Area Fill */}
          <Path d={areaPath} fill={`url(#grad-${title})`} />

          {/* Main Trend Line */}
          <Path
            d={linePath}
            fill="none"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {coords.map((c, i) => (
            <Circle
              key={`dot-${i}`}
              cx={c.x}
              cy={c.y}
              r={i === coords.length - 1 ? 4.5 : 3}
              fill={i === coords.length - 1 ? accentColor : Colors.card}
              stroke={accentColor}
              strokeWidth={i === coords.length - 1 ? 2.5 : 1.5}
            />
          ))}
        </Svg>
      </View>

      {/* X-Axis Labels */}
      <View style={styles.xAxisRow}>
        {points.map((p, idx) => (
          <Text key={`${p.label}-${idx}`} style={styles.xAxisLabel}>
            {p.label}
          </Text>
        ))}
      </View>

      {/* Target Benchmark Footer */}
      {targetValue && (
        <View style={styles.footerRow}>
          <View style={styles.targetIndicator}>
            <View style={styles.dashLine} />
            <Text style={styles.targetText}>
              Benchmark Target: {targetValue}{unit}
            </Text>
          </View>
          <Text style={styles.peakText}>
            Peak: {peakValue}{unit}
          </Text>
        </View>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  categoryTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  rightStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avgBadge: {
    alignItems: 'flex-end',
  },
  avgLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  avgValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  deltaPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: `${Colors.success}33`,
  },
  deltaText: {
    fontSize: 10,
    fontWeight: '700',
  },
  svgContainer: {
    marginVertical: 4,
    overflow: 'hidden',
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  xAxisLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Layout.spacing.sm,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  targetIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dashLine: {
    width: 14,
    height: 1.5,
    backgroundColor: Colors.textMuted,
  },
  targetText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  peakText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
});
