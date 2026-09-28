import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { AppCard } from '../common/AppCard';

interface ReflectionSectionProps {
  bestMoment: string;
  regretOfDay: string;
  onChangeBestMoment: (text: string) => void;
  onChangeRegret: (text: string) => void;
}

export const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  bestMoment,
  regretOfDay,
  onChangeBestMoment,
  onChangeRegret,
}) => {
  return (
    <AppCard style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: `${Colors.warning}1A` }]}>
            <MaterialCommunityIcons name="feather" size={18} color={Colors.warning} />
          </View>
          <View>
            <Text style={styles.sectionTag}>SECTION H</Text>
            <Text style={styles.sectionTitle}>Evening Reflection</Text>
          </View>
        </View>

        <View style={styles.stoicBadge}>
          <Text style={styles.stoicBadgeText}>STOIC LOG</Text>
        </View>
      </View>

      {/* Field 1: Best Moment Of The Day */}
      <View style={styles.fieldBlock}>
        <View style={styles.labelRow}>
          <MaterialCommunityIcons name="star-outline" size={15} color={Colors.warning} />
          <Text style={styles.fieldLabel}>BEST MOMENT OF THE DAY</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="What brought deep gratitude, victory, or meaningful progress today?"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={2}
          value={bestMoment}
          onChangeText={onChangeBestMoment}
          textAlignVertical="top"
        />
      </View>

      {/* Field 2: Regret Of The Day */}
      <View style={[styles.fieldBlock, { marginTop: Layout.spacing.md }]}>
        <View style={styles.labelRow}>
          <MaterialCommunityIcons name="compass-outline" size={15} color={Colors.danger} />
          <Text style={[styles.fieldLabel, { color: Colors.textSecondary }]}>
            REGRET OR LESSON OF THE DAY
          </Text>
        </View>
        <TextInput
          style={[styles.textInput, styles.regretInput]}
          placeholder="Where did discipline falter? What friction will you eliminate tomorrow?"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={2}
          value={regretOfDay}
          onChangeText={onChangeRegret}
          textAlignVertical="top"
        />
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
  stoicBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  stoicBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  fieldBlock: {},
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  textInput: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Layout.spacing.md,
    fontSize: 13,
    color: Colors.textPrimary,
    minHeight: 70,
    lineHeight: 18,
  },
  regretInput: {
    borderColor: `${Colors.cardBorder}`,
  },
});
