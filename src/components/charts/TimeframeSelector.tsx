import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '../../constants/theme';
import { Timeframe } from '../../services/statisticsService';

interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe;
  onSelect: (tf: Timeframe) => void;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onSelect,
}) => {
  const options: { key: Timeframe; label: string }[] = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
  ];

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isActive = selectedTimeframe === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 3,
    marginBottom: Layout.spacing.lg,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Layout.radius.sm,
  },
  segmentBtnActive: {
    backgroundColor: Colors.cardElevated,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  segmentTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
