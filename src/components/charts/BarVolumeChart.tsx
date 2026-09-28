import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { Colors, Layout } from '../../constants/theme';
import { ChartDataPoint } from '../../services/statisticsService';
import { AppCard } from '../common/AppCard';

interface BarVolumeChartProps {
  title: string;
  categoryTag: string;
  points: ChartDataPoint[];
  averageValue: number;
  totalVolume?: number;
  targetValue?: number;
  unit?: string;
  prefix?: string;
  accentColor?: string;
  deltaPercent?: number;
}

export const BarVolumeChart: React.FC<BarVolumeChartProps> = ({
  title,
  categoryTag,
  points,
  averageValue,
  totalVolume,
  targetValue,
  unit = '',
  prefix = '',
  accentColor = Colors.primary,
  deltaPercent,
}) => {
  const chartHeight = 120;
  const chartWidth = 310;
  const paddingX = 14;
  const paddingY = 16;

  const values = points.map((p) => p.value);
  const maxVal = Math.max(...values, targetValue || 0) * 1.15 || 10;
  
  const barCount = points.length;
  const availableWidth = chartWidth - paddingX * 2;
  const barWidth = Math.min(Math.max(availableWidth / barCount - 6, 8), 24);
  const spacing = (availableWidth - barWidth * barCount) / (barCount - 1 || 1);

  // Target Line Y
  const targetY = targetValue
    ? chartHeight - paddingY - (targetValue / maxVal) * (chartHeight - paddingY * 2)
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
          {totalVolume !== undefined ? (
            <View style={styles.statGroup}>
              <Text style={styles.statLabel}>TOTAL</Text>
              <Text style={[styles.statValue, { color: Colors.textPrimary }]}>
                {prefix}{totalVolume.toLocaleString()}{unit}
              </Text>
            </View>
          ) : (
            <View style={styles.statGroup}>
              <Text style={styles.statLabel}>AVG</Text>
              <Text style={[styles.statValue, { color: accentColor }]}>
                {prefix}{averageValue.toLocaleString()}{unit}
              </Text>
            </View>
          )}

          {deltaPercent !== undefined && (
            <View
              style={[
                styles.deltaPill,
                deltaPercent >= 0
                  ? { backgroundColor: `${Colors.success}1A`, borderColor: `${Colors.success}33` }
                  : { backgroundColor: `${Colors.primary}1A`, borderColor: `${Colors.primary}33` },
              ]}
            >
              <Text
                style={[
                  styles.deltaText,
                  { color: deltaPercent >= 0 ? Colors.success : Colors.primary },
                ]}
              >
                {deltaPercent >= 0 ? '↑' : '↓'} {Math.abs(deltaPercent)}%
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* SVG Bar Chart */}
      <View style={styles.svgContainer}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Target Benchmark Line */}
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

          {/* Vertical Bars */}
          {points.map((p, idx) => {
            const barHeight = Math.max(((p.value / maxVal) * (chartHeight - paddingY * 2)), 3);
            const x = paddingX + idx * (barWidth + spacing);
            const y = chartHeight - paddingY - barHeight;
            const isTargetHit = targetValue ? p.value >= targetValue : true;

            return (
              <Rect
                key={`bar-${idx}`}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={barWidth / 2.5}
                fill={isTargetHit ? accentColor : `${accentColor}80`}
              />
            );
          })}
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

      {/* Benchmark Footer */}
      {targetValue && (
        <View style={styles.footerRow}>
          <View style={styles.targetIndicator}>
            <View style={styles.dashLine} />
            <Text style={styles.targetText}>
              Target: {prefix}{targetValue.toLocaleString()}{unit}
            </Text>
          </View>
          <Text style={styles.avgText}>
            Avg: {prefix}{averageValue.toLocaleString()}{unit}
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
  statGroup: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  deltaPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
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
  avgText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
});
