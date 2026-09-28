import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { AppCard } from '../common/AppCard';

interface ReportHeroCardProps {
  avgScore: number;
  weekStartDate: string;
  weekEndDate: string;
  summary: string;
}

export const ReportHeroCard: React.FC<ReportHeroCardProps> = ({
  avgScore,
  weekStartDate,
  weekEndDate,
  summary,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.primary;
    if (score >= 40) return Colors.warning;
    return Colors.danger;
  };

  const scoreColor = getScoreColor(avgScore);

  return (
    <AppCard style={styles.card} glowColor={`${scoreColor}33`}>
      {/* Top Meta Bar */}
      <View style={styles.topRow}>
        <View style={styles.aiBadge}>
          <MaterialCommunityIcons name="creation" size={14} color="#9D65FF" />
          <Text style={styles.aiBadgeText}>GEMINI AI SYNTHESIS</Text>
        </View>

        <View style={styles.datePill}>
          <Text style={styles.dateText}>
            {weekStartDate} → {weekEndDate}
          </Text>
        </View>
      </View>

      {/* Hero Score Display */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreLeft}>
          <Text style={styles.scoreLabel}>WEEKLY DISCIPLINE SCORE</Text>
          <View style={styles.scoreValueGroup}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>
              {avgScore}
            </Text>
            <Text style={styles.scoreMax}>/ 100</Text>
          </View>
        </View>

        <View style={[styles.ratingPill, { backgroundColor: `${scoreColor}1A`, borderColor: `${scoreColor}40` }]}>
          <Text style={[styles.ratingText, { color: scoreColor }]}>
            {avgScore >= 80 ? 'OPTIMAL TIER' : avgScore >= 60 ? 'STABLE' : 'NEEDS ACTION'}
          </Text>
        </View>
      </View>

      {/* Executive Summary Block */}
      <View style={styles.summaryBlock}>
        <View style={styles.summaryHeader}>
          <MaterialCommunityIcons name="text-box-search-outline" size={15} color={Colors.textSecondary} />
          <Text style={styles.summaryTitle}>EXECUTIVE SUMMARY</Text>
        </View>
        <Text style={styles.summaryBody}>{summary}</Text>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#9D65FF18',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: '#9D65FF33',
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9D65FF',
    letterSpacing: 0.9,
  },
  datePill: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Layout.spacing.md,
  },
  scoreLeft: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  scoreValueGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  ratingPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  summaryBlock: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Layout.spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  summaryBody: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    fontWeight: '400',
  },
});
