import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { AppCard } from '../common/AppCard';
import { getWorkoutForDay } from '../../constants/workoutSchedule';

interface WorkoutSectionProps {
  selectedDayIndex: number; // 0=Sun, 1=Mon, ..., 6=Sat
  workoutCompleted: boolean;
  workoutMinutes: number;
  onSelectDay: (dayIndex: number) => void;
  onToggleCompleted: (completed: boolean) => void;
  onChangeMinutes: (minutes: number) => void;
}

export const WorkoutSection: React.FC<WorkoutSectionProps> = ({
  selectedDayIndex,
  workoutCompleted,
  workoutMinutes,
  onSelectDay,
  onToggleCompleted,
  onChangeMinutes,
}) => {
  const currentPlan = getWorkoutForDay(selectedDayIndex);
  const isRestDay = currentPlan.isRest;

  const daysList = [
    { index: 1, label: 'Mon' },
    { index: 2, label: 'Tue' },
    { index: 3, label: 'Wed' },
    { index: 4, label: 'Thu' },
    { index: 5, label: 'Fri' },
    { index: 6, label: 'Sat' },
    { index: 0, label: 'Sun' },
  ];

  const minutePresets = [30, 45, 60, 90];

  return (
    <AppCard style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: `${Colors.danger}1A` }]}>
            <MaterialCommunityIcons name="dumbbell" size={18} color={Colors.danger} />
          </View>
          <View>
            <Text style={styles.sectionTag}>SECTION C</Text>
            <Text style={styles.sectionTitle}>Physical Conditioning</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            workoutCompleted && styles.statusBadgeCompleted,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              workoutCompleted && { color: Colors.success },
            ]}
          >
            {workoutCompleted ? 'Completed (20 pts)' : 'Pending (0/20)'}
          </Text>
        </View>
      </View>

      {/* Day Selector Pills */}
      <Text style={styles.fieldLabel}>SCHEDULED DAY & SPLIT</Text>
      <View style={styles.daySelectorRow}>
        {daysList.map((d) => {
          const isSelected = selectedDayIndex === d.index;
          return (
            <TouchableOpacity
              key={d.label}
              onPress={() => onSelectDay(d.index)}
              style={[styles.dayChip, isSelected && styles.dayChipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayChipText, isSelected && styles.dayChipTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Routine Detail Card */}
      <View style={[styles.routineCard, isRestDay && styles.routineCardRest]}>
        <View style={styles.routineHeader}>
          <Text style={styles.routineDay}>{currentPlan.dayName.toUpperCase()}</Text>
          <View
            style={[
              styles.routineTypePill,
              isRestDay ? { backgroundColor: `${Colors.primary}20` } : { backgroundColor: `${Colors.danger}20` },
            ]}
          >
            <Text
              style={[
                styles.routineTypeText,
                { color: isRestDay ? Colors.primary : Colors.danger },
              ]}
            >
              {isRestDay ? 'ACTIVE RECOVERY' : 'HYPERTROPHY'}
            </Text>
          </View>
        </View>
        <Text style={styles.routineTarget}>{currentPlan.targetMuscles}</Text>
      </View>

      {/* Workout Completed Checkbox Row */}
      <TouchableOpacity
        style={[
          styles.checkboxCard,
          workoutCompleted && styles.checkboxCardChecked,
        ]}
        onPress={() => onToggleCompleted(!workoutCompleted)}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.checkCircle,
            workoutCompleted && styles.checkCircleChecked,
          ]}
        >
          {workoutCompleted && (
            <MaterialCommunityIcons name="check" size={16} color="#0F1117" />
          )}
        </View>
        <View style={styles.checkTextGroup}>
          <Text style={styles.checkTitle}>
            {isRestDay ? 'Recovery & Stretch Completed' : 'Workout Session Completed'}
          </Text>
          <Text style={styles.checkSub}>
            {workoutCompleted
              ? 'Discipline points logged into daily scoring engine'
              : 'Tap to mark as executed'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Workout Minutes (if not rest day or optional for recovery) */}
      {!isRestDay && (
        <View style={styles.minutesSection}>
          <View style={styles.minutesHeader}>
            <Text style={styles.fieldLabel}>SESSION DURATION (MINUTES)</Text>
            <Text style={styles.minutesValue}>{workoutMinutes} mins</Text>
          </View>

          <View style={styles.minutePresetsRow}>
            {minutePresets.map((mins) => {
              const isSelected = workoutMinutes === mins;
              return (
                <TouchableOpacity
                  key={mins}
                  onPress={() => onChangeMinutes(mins)}
                  style={[
                    styles.minuteChip,
                    isSelected && styles.minuteChipActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.minuteChipText,
                      isSelected && styles.minuteChipTextActive,
                    ]}
                  >
                    {mins}m
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={() => onChangeMinutes(workoutMinutes + 5)}
              style={styles.minutePlusChip}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="plus" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    borderColor: `${Colors.danger}33`,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statusBadgeCompleted: {
    backgroundColor: `${Colors.success}1A`,
    borderColor: `${Colors.success}40`,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Layout.spacing.sm,
  },
  daySelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: Layout.spacing.md,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dayChipActive: {
    backgroundColor: Colors.cardElevated,
    borderColor: Colors.primary,
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  dayChipTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  routineCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  routineCardRest: {
    borderColor: `${Colors.primary}33`,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  routineDay: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  routineTypePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Layout.radius.sm,
  },
  routineTypeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  routineTarget: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  checkboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    gap: 12,
  },
  checkboxCardChecked: {
    borderColor: `${Colors.success}40`,
    backgroundColor: '#12201D',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkTextGroup: {
    flex: 1,
  },
  checkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  checkSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  minutesSection: {
    marginTop: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  minutesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minutesValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  minutePresetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Layout.spacing.xs,
  },
  minuteChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  minuteChipActive: {
    backgroundColor: `${Colors.primary}20`,
    borderColor: Colors.primary,
  },
  minuteChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  minuteChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  minutePlusChip: {
    width: 38,
    height: 38,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
