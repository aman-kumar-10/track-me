import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { AppCard } from '../common/AppCard';
import { ProgressBar } from '../common/ProgressBar';

interface StudySectionProps {
  studyMinutes: number;
  studyNotes: string;
  onChangeMinutes: (mins: number) => void;
  onChangeNotes: (notes: string) => void;
}

const STUDY_GOAL = 90;

export const StudySection: React.FC<StudySectionProps> = ({
  studyMinutes,
  studyNotes,
  onChangeMinutes,
  onChangeNotes,
}) => {
  const percentage = Math.min(Math.round((studyMinutes / STUDY_GOAL) * 100), 100);
  const isGoalReached = studyMinutes >= STUDY_GOAL;
  const remainingMins = Math.max(STUDY_GOAL - studyMinutes, 0);

  const presets = [15, 30, 45, 60, 90];

  return (
    <AppCard style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: '#9D65FF1A' }]}>
            <MaterialCommunityIcons name="book-open-page-variant-outline" size={18} color="#9D65FF" />
          </View>
          <View>
            <Text style={styles.sectionTag}>SECTION G</Text>
            <Text style={styles.sectionTitle}>Deep Work & Study</Text>
          </View>
        </View>

        <View style={[styles.goalBadge, isGoalReached && styles.goalBadgeReached]}>
          <Text style={[styles.goalBadgeText, isGoalReached && { color: Colors.success }]}>
            {isGoalReached ? '90m Target Met (20 pts)' : `Goal: 90 mins`}
          </Text>
        </View>
      </View>

      {/* Progress & Value */}
      <View style={styles.metricRow}>
        <View style={styles.valueGroup}>
          <Text style={styles.currentValue}>{studyMinutes}</Text>
          <Text style={styles.goalValue}>/ {STUDY_GOAL} mins</Text>
        </View>
        <Text style={[styles.percentValue, isGoalReached && { color: Colors.success }]}>
          {percentage}%
        </Text>
      </View>

      <ProgressBar
        progress={percentage}
        color={isGoalReached ? Colors.success : '#9D65FF'}
        height={6}
        style={styles.progressBar}
      />

      <Text style={styles.caption}>
        {isGoalReached
          ? 'Deep work quota reached. Full intellectual score registered.'
          : `${remainingMins} mins required to satisfy today's learning objective.`}
      </Text>

      {/* Minute Presets */}
      <Text style={styles.fieldLabel}>ADD MINUTES TO LOG</Text>
      <View style={styles.presetsRow}>
        {presets.map((mins) => (
          <TouchableOpacity
            key={mins}
            onPress={() => onChangeMinutes(studyMinutes + mins)}
            style={styles.presetChip}
            activeOpacity={0.7}
          >
            <Text style={styles.presetChipText}>+{mins}m</Text>
          </TouchableOpacity>
        ))}

        {studyMinutes > 0 && (
          <TouchableOpacity
            onPress={() => onChangeMinutes(Math.max(0, studyMinutes - 15))}
            style={styles.minusChip}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="minus" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Study Notes Text Area */}
      <Text style={[styles.fieldLabel, { marginTop: Layout.spacing.md }]}>
        STUDY NOTES & CONCEPT MASTERY
      </Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Document key insights, algorithms studied, reading reflections, or breakthroughs..."
        placeholderTextColor={Colors.textMuted}
        multiline
        numberOfLines={3}
        value={studyNotes}
        onChangeText={onChangeNotes}
        textAlignVertical="top"
      />
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
    borderColor: '#9D65FF33',
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: Layout.spacing.xs,
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currentValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  goalValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  percentValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9D65FF',
  },
  progressBar: {
    marginVertical: Layout.spacing.xs,
  },
  caption: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.md,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Layout.spacing.sm,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: '#9D65FF33',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9D65FF',
  },
  minusChip: {
    width: 36,
    height: 34,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesInput: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Layout.spacing.md,
    fontSize: 13,
    color: Colors.textPrimary,
    minHeight: 80,
    lineHeight: 18,
  },
});
