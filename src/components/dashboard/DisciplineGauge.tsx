import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Layout } from '../../constants/theme';
import { DisciplineScores } from '../../types';
import { AppCard } from '../common/AppCard';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface DisciplineGaugeProps {
  scores: DisciplineScores;
}

export const DisciplineGauge: React.FC<DisciplineGaugeProps> = ({ scores }) => {
  const size = 184;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const clampedScore = Math.min(Math.max(scores.today, 0), 100);
  const targetOffset = circumference - (circumference * clampedScore) / 100;

  // Animation values
  const [animatedProgress] = useState(() => new Animated.Value(circumference));
  const [scaleAnim] = useState(() => new Animated.Value(0.92));
  const [opacityAnim] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedProgress, {
        toValue: targetOffset,
        duration: 1100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scores.today, targetOffset, animatedProgress, scaleAnim, opacityAnim]);

  const getScoreColor = (score: number) => {
    if (score === 0) return Colors.primary;
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.primary;
    if (score >= 40) return Colors.warning;
    return Colors.danger;
  };

  const currentScoreColor = getScoreColor(scores.today);

  const getStatusLabel = (score: number) => {
    if (score === 0) return 'READY TO LOG';
    if (score >= 85) return 'EXCELLENT';
    if (score >= 70) return 'DISCIPLINED';
    if (score >= 50) return 'MODERATE';
    return 'CRITICAL';
  };

  return (
    <AppCard style={styles.container} glowColor={`${currentScoreColor}33`}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionOverline}>PERFORMANCE INDEX</Text>
          <Text style={styles.sectionTitle}>Discipline Engine</Text>
        </View>
        <View
          style={[
            styles.trendBadge,
            { backgroundColor: scores.weeklyChangePercent > 0 ? `${Colors.success}18` : `${Colors.primary}18` },
          ]}
        >
          <Text
            style={[
              styles.trendText,
              { color: scores.weeklyChangePercent > 0 ? Colors.success : Colors.primary },
            ]}
          >
            {scores.weeklyChangePercent > 0
              ? `↑ ${scores.weeklyChangePercent}% this wk`
              : 'Target: ≥85 pts'}
          </Text>
        </View>
      </View>

      {/* Main SVG Circular Ring with Native Animations */}
      <Animated.View
        style={[
          styles.gaugeContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={currentScoreColor} />
              <Stop offset="100%" stopColor={Colors.primary} />
            </LinearGradient>
          </Defs>

          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1C2130"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Active Animated Score Ring */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={animatedProgress}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* Central Display */}
        <View style={styles.centerContent}>
          <Text style={styles.scoreNumber}>{scores.today}</Text>
          <Text style={styles.scoreMax}>/ 100</Text>
          <View style={[styles.statusPill, { backgroundColor: `${currentScoreColor}22` }]}>
            <Text style={[styles.statusPillText, { color: currentScoreColor }]}>
              {getStatusLabel(scores.today)}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Split Sub-Scores: Weekly & Monthly */}
      <View style={styles.subScoresContainer}>
        <View style={styles.subScoreItem}>
          <View style={styles.subScoreHeader}>
            <Text style={styles.subScoreLabel}>Weekly Average</Text>
            <Text style={[styles.subScoreValue, { color: getScoreColor(scores.weekly) }]}>
              {scores.weekly}%
            </Text>
          </View>
          <View style={styles.miniBarTrack}>
            <View
              style={[
                styles.miniBarFill,
                { width: `${scores.weekly}%`, backgroundColor: getScoreColor(scores.weekly) },
              ]}
            />
          </View>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.subScoreItem}>
          <View style={styles.subScoreHeader}>
            <Text style={styles.subScoreLabel}>Monthly Score</Text>
            <Text style={[styles.subScoreValue, { color: getScoreColor(scores.monthly) }]}>
              {scores.monthly}%
            </Text>
          </View>
          <View style={styles.miniBarTrack}>
            <View
              style={[
                styles.miniBarFill,
                { width: `${scores.monthly}%`, backgroundColor: getScoreColor(scores.monthly) },
              ]}
            />
          </View>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionOverline: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    borderColor: `${Colors.success}33`,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Layout.spacing.md,
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: -4,
  },
  statusPill: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.radius.sm,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  subScoresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  subScoreItem: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.divider,
    marginHorizontal: Layout.spacing.md,
  },
  subScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subScoreLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  subScoreValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  miniBarTrack: {
    height: 4,
    backgroundColor: '#212635',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
