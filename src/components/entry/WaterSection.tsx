import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { AppCard } from '../common/AppCard';
import { ProgressBar } from '../common/ProgressBar';

interface WaterSectionProps {
  waterMl: number;
  onAddWater: (amount: number) => void;
  onResetWater: () => void;
}

const WATER_GOAL = 3000;

export const WaterSection: React.FC<WaterSectionProps> = ({
  waterMl,
  onAddWater,
  onResetWater,
}) => {
  const percentage = Math.min(Math.round((waterMl / WATER_GOAL) * 100), 100);
  const isGoalReached = waterMl >= WATER_GOAL;
  const remainingMl = Math.max(WATER_GOAL - waterMl, 0);

  return (
    <AppCard style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: `${Colors.primary}1A` }]}>
            <MaterialCommunityIcons name="cup-water" size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.sectionTag}>SECTION B</Text>
            <Text style={styles.sectionTitle}>Water Tracker</Text>
          </View>
        </View>

        <View style={[styles.goalBadge, isGoalReached && styles.goalBadgeReached]}>
          <Text style={[styles.goalBadgeText, isGoalReached && { color: Colors.success }]}>
            {isGoalReached ? '3,000 ml Achieved' : `Goal: 3,000 ml`}
          </Text>
        </View>
      </View>

      {/* Numerical Volume Indicator */}
      <View style={styles.volumeDisplay}>
        <View style={styles.volumeRow}>
          <Text style={styles.currentVolume}>{waterMl.toLocaleString()}</Text>
          <Text style={styles.maxVolume}>/ {WATER_GOAL.toLocaleString()} ml</Text>
        </View>
        <Text style={[styles.percentageText, isGoalReached && { color: Colors.success }]}>
          {percentage}%
        </Text>
      </View>

      {/* Progress Bar */}
      <ProgressBar
        progress={percentage}
        color={isGoalReached ? Colors.success : Colors.primary}
        height={8}
        style={styles.progressBar}
      />

      <Text style={styles.statusCaption}>
        {isGoalReached
          ? '🎉 Hydration target unlocked. 15/15 discipline points awarded.'
          : `${remainingMl} ml remaining to hit target.`}
      </Text>

      {/* The 3 Required Increment Buttons */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => onAddWater(100)}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons name="plus" size={14} color={Colors.primary} />
          <Text style={styles.addBtnText}>+100 ml</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => onAddWater(200)}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons name="plus" size={14} color={Colors.primary} />
          <Text style={styles.addBtnText}>+200 ml</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addBtn, styles.addBtnLarge]}
          onPress={() => onAddWater(500)}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons name="plus" size={14} color="#0F1117" />
          <Text style={[styles.addBtnText, styles.addBtnLargeText]}>+500 ml</Text>
        </TouchableOpacity>

        {waterMl > 0 && (
          <TouchableOpacity
            style={styles.minusBtn}
            onPress={() => onAddWater(-100)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="minus" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  goalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  goalBadgeReached: {
    backgroundColor: `${Colors.success}1A`,
    borderColor: `${Colors.success}40`,
  },
  goalBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  volumeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: Layout.spacing.xs,
    marginBottom: 6,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currentVolume: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  maxVolume: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBar: {
    marginVertical: Layout.spacing.xs,
  },
  statusCaption: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: Layout.spacing.md,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: `${Colors.primary}40`,
    paddingVertical: 10,
    borderRadius: Layout.radius.md,
    gap: 3,
  },
  addBtnLarge: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  addBtnLargeText: {
    color: '#0F1117',
  },
  minusBtn: {
    width: 38,
    height: 38,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
