import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { StreakInfo } from '../../types';
import { AppCard } from '../common/AppCard';
import { ProgressBar } from '../common/ProgressBar';

interface StreakWidgetProps {
  streak: StreakInfo;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ streak }) => {
  return (
    <AppCard style={styles.card}>
      {/* Top Banner: Daily Streak & Record */}
      <View style={styles.topRow}>
        <View style={styles.streakLeft}>
          <View style={styles.fireIconContainer}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.warning} />
          </View>
          <View>
            <View style={styles.streakCountRow}>
              <Text style={styles.streakCount}>{streak.currentStreak}</Text>
              <Text style={styles.streakUnit}>DAYS</Text>
            </View>
            <Text style={styles.streakSub}>Active Daily Streak</Text>
          </View>
        </View>

        <View style={styles.streakRightBadge}>
          <Text style={styles.bestLabel}>PERSONAL BEST</Text>
          <Text style={styles.bestValue}>{streak.bestStreak} Days</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Week Progress Row (M T W T F S S) */}
      <View style={styles.weekSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CURRENT WEEK PROGRESS</Text>
          <Text style={styles.sectionMeta}>
            {streak.weekDays.filter((d) => d.completed).length}/7 Targets Hit
          </Text>
        </View>

        <View style={styles.daysRow}>
          {streak.weekDays.map((item, idx) => {
            const isCompleted = item.completed;
            const isToday = item.isToday;
            const isFuture = item.isFuture;

            return (
              <View key={`${item.dayName}-${idx}`} style={styles.dayCol}>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                  {item.dayName}
                </Text>
                <View
                  style={[
                    styles.dayPill,
                    isCompleted && styles.dayPillCompleted,
                    isToday && !isCompleted && styles.dayPillToday,
                    isFuture && styles.dayPillFuture,
                  ]}
                >
                  {isCompleted ? (
                    <MaterialCommunityIcons name="check" size={14} color="#0F1117" />
                  ) : isToday ? (
                    <View style={styles.todayInnerDot} />
                  ) : (
                    <Text style={styles.dayDotText}>—</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Monthly Consistency */}
      <View style={styles.consistencySection}>
        <View style={styles.consistencyHeader}>
          <Text style={styles.consistencyLabel}>Monthly Consistency</Text>
          <Text style={styles.consistencyValue}>{streak.monthlyConsistency}%</Text>
        </View>
        <ProgressBar
          progress={streak.monthlyConsistency}
          color={Colors.success}
          height={5}
        />
        <Text style={styles.consistencyCaption}>
          Target: Maintain ≥85% consistency to lock weekly discipline rewards.
        </Text>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Layout.spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fireIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Layout.radius.md,
    backgroundColor: `${Colors.warning}1A`,
    borderWidth: 1,
    borderColor: `${Colors.warning}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  streakCount: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  streakUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.warning,
    letterSpacing: 1,
  },
  streakSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  streakRightBadge: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Layout.radius.md,
    alignItems: 'flex-end',
  },
  bestLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  bestValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Layout.spacing.md,
  },
  weekSection: {
    marginBottom: Layout.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.1,
  },
  sectionMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  dayLabelToday: {
    color: Colors.primary,
    fontWeight: '700',
  },
  dayPill: {
    width: 34,
    height: 34,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  dayPillToday: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: `${Colors.primary}1A`,
  },
  dayPillFuture: {
    opacity: 0.45,
  },
  todayInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  dayDotText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  consistencySection: {
    paddingTop: Layout.spacing.sm,
  },
  consistencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  consistencyLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  consistencyValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.success,
  },
  consistencyCaption: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 6,
    lineHeight: 14,
  },
});
