import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { AppCard } from '../common/AppCard';

interface WakeUpSectionProps {
  wakeUpTime: string; // "HH:MM" e.g. "05:45"
  wakeUpAmPm: 'AM' | 'PM';
  onChangeTime: (time: string, amPm: 'AM' | 'PM') => void;
}

export const checkIsWakeUpOptimal = (timeStr: string, amPm: 'AM' | 'PM'): boolean => {
  if (amPm !== 'AM') return false;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return false;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return false;

  const totalMinutes = hours * 60 + minutes;
  // 5:30 AM = 5 * 60 + 30 = 330
  // 6:00 AM = 6 * 60 = 360
  return totalMinutes >= 330 && totalMinutes <= 360;
};

export const WakeUpSection: React.FC<WakeUpSectionProps> = ({
  wakeUpTime,
  wakeUpAmPm,
  onChangeTime,
}) => {
  const isOptimal = checkIsWakeUpOptimal(wakeUpTime, wakeUpAmPm);

  const presets = [
    { time: '05:30', amPm: 'AM' as const, label: '05:30 AM' },
    { time: '05:45', amPm: 'AM' as const, label: '05:45 AM' },
    { time: '06:00', amPm: 'AM' as const, label: '06:00 AM' },
    { time: '06:30', amPm: 'AM' as const, label: '06:30 AM' },
    { time: '07:00', amPm: 'AM' as const, label: '07:00 AM' },
  ];

  return (
    <AppCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: `${Colors.warning}1A` }]}>
            <MaterialCommunityIcons name="weather-sunset-up" size={18} color={Colors.warning} />
          </View>
          <View>
            <Text style={styles.sectionTag}>SECTION A</Text>
            <Text style={styles.sectionTitle}>Wake Up Time</Text>
          </View>
        </View>

        <View style={[styles.ruleBadge, isOptimal ? styles.ruleBadgeSuccess : styles.ruleBadgeDefault]}>
          <Text style={[styles.ruleBadgeText, isOptimal && { color: Colors.success }]}>
            {isOptimal ? 'Target Met (15 pts)' : 'Rule: 5:30 - 6:00 AM'}
          </Text>
        </View>
      </View>

      {/* Main Time Display Card */}
      <View style={[styles.timeDisplayCard, isOptimal && styles.timeCardOptimal]}>
        <View style={styles.timeValueGroup}>
          <Text style={styles.timeText}>{wakeUpTime}</Text>
          <View style={styles.amPmContainer}>
            <TouchableOpacity
              onPress={() => onChangeTime(wakeUpTime, 'AM')}
              style={[styles.amPmBtn, wakeUpAmPm === 'AM' && styles.amPmBtnActive]}
            >
              <Text style={[styles.amPmText, wakeUpAmPm === 'AM' && styles.amPmTextActive]}>
                AM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onChangeTime(wakeUpTime, 'PM')}
              style={[styles.amPmBtn, wakeUpAmPm === 'PM' && styles.amPmBtnActive]}
            >
              <Text style={[styles.amPmText, wakeUpAmPm === 'PM' && styles.amPmTextActive]}>
                PM
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.timeStatusIndicator}>
          <MaterialCommunityIcons
            name={isOptimal ? 'check-circle' : 'alert-circle-outline'}
            size={18}
            color={isOptimal ? Colors.success : Colors.warning}
          />
          <Text style={[styles.timeStatusText, { color: isOptimal ? Colors.success : Colors.warning }]}>
            {isOptimal ? 'Optimal Discipline Window' : 'Outside Target Window'}
          </Text>
        </View>
      </View>

      {/* Quick Time Presets */}
      <Text style={styles.presetsLabel}>QUICK SELECT PRESETS</Text>
      <View style={styles.presetsRow}>
        {presets.map((preset) => {
          const isSelected = wakeUpTime === preset.time && wakeUpAmPm === preset.amPm;
          const presetIsOptimal = checkIsWakeUpOptimal(preset.time, preset.amPm);

          return (
            <TouchableOpacity
              key={preset.label}
              onPress={() => onChangeTime(preset.time, preset.amPm)}
              style={[
                styles.presetChip,
                isSelected && styles.presetChipSelected,
                presetIsOptimal && isSelected && styles.presetChipOptimalSelected,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.presetChipText,
                  isSelected && styles.presetChipTextSelected,
                  presetIsOptimal && !isSelected && { color: Colors.textSecondary },
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    borderColor: `${Colors.warning}33`,
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
  ruleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  ruleBadgeSuccess: {
    backgroundColor: `${Colors.success}1A`,
    borderColor: `${Colors.success}40`,
  },
  ruleBadgeDefault: {
    backgroundColor: Colors.surfaceSubtle,
  },
  ruleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeDisplayCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Layout.spacing.md,
    marginVertical: Layout.spacing.sm,
  },
  timeCardOptimal: {
    borderColor: `${Colors.success}40`,
    backgroundColor: '#12201D',
  },
  timeValueGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  amPmContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  amPmBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  amPmBtnActive: {
    backgroundColor: Colors.primary,
  },
  amPmText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  amPmTextActive: {
    color: '#0F1117',
  },
  timeStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  timeStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  presetsLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Layout.radius.sm,
  },
  presetChipSelected: {
    backgroundColor: Colors.cardElevated,
    borderColor: Colors.primary,
  },
  presetChipOptimalSelected: {
    backgroundColor: `${Colors.success}22`,
    borderColor: Colors.success,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  presetChipTextSelected: {
    color: Colors.textPrimary,
  },
});
