import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { OfficeStatus } from '../../types';
import { AppCard } from '../common/AppCard';

interface OfficeSectionProps {
  officeStatus: OfficeStatus;
  onSelectStatus: (status: OfficeStatus) => void;
}

export const OfficeSection: React.FC<OfficeSectionProps> = ({
  officeStatus,
  onSelectStatus,
}) => {
  const options: { status: OfficeStatus; label: string; icon: string; desc: string }[] = [
    { status: 'Office', label: 'Workday', icon: 'briefcase-outline', desc: 'Standard business hours' },
    { status: 'Leave', label: 'Leave', icon: 'airplane-takeoff', desc: 'Scheduled PTO / Out' },
    { status: 'Weekend', label: 'Weekend', icon: 'coffee-outline', desc: 'Recharge / Unstructured' },
  ];

  return (
    <AppCard style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: `${Colors.primary}1A` }]}>
            <MaterialCommunityIcons name="briefcase-outline" size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.sectionTag}>SECTION E</Text>
            <Text style={styles.sectionTitle}>Workday Status</Text>
          </View>
        </View>

        <View style={styles.activePill}>
          <Text style={styles.activePillText}>{officeStatus.toUpperCase()}</Text>
        </View>
      </View>

      {/* 3 Option Pills */}
      <View style={styles.optionsRow}>
        {options.map((opt) => {
          const isSelected = officeStatus === opt.status;
          return (
            <TouchableOpacity
              key={opt.status}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
              onPress={() => onSelectStatus(opt.status)}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons
                name={opt.icon as any}
                size={20}
                color={isSelected ? Colors.primary : Colors.textMuted}
              />
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                {opt.label}
              </Text>
              <Text style={styles.optionDesc} numberOfLines={1}>
                {opt.desc}
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
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    backgroundColor: `${Colors.primary}1A`,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionCard: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xs,
    alignItems: 'center',
    gap: 4,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cardElevated,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  optionLabelSelected: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
