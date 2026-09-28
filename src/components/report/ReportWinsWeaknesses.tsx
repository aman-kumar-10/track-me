import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { AppCard } from '../common/AppCard';

interface ReportWinsWeaknessesProps {
  wins: string[];
  weaknesses: string[];
  suggestions: string[];
}

export const ReportWinsWeaknesses: React.FC<ReportWinsWeaknessesProps> = ({
  wins,
  weaknesses,
  suggestions,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. TOP WINS */}
      <View style={styles.block}>
        <View style={styles.blockHeader}>
          <MaterialCommunityIcons name="trophy-outline" size={16} color={Colors.success} />
          <Text style={[styles.blockTitle, { color: Colors.success }]}>
            TOP EXECUTION WINS ({wins.length})
          </Text>
        </View>

        <AppCard style={styles.card} glowColor={`${Colors.success}26`}>
          {wins.map((win, idx) => (
            <View key={`win-${idx}`} style={styles.listItem}>
              <View style={[styles.bulletCircle, { backgroundColor: `${Colors.success}22` }]}>
                <MaterialCommunityIcons name="check" size={12} color={Colors.success} />
              </View>
              <Text style={styles.itemText}>{win}</Text>
            </View>
          ))}
        </AppCard>
      </View>

      {/* 2. WEAKNESSES & FRICTION */}
      <View style={styles.block}>
        <View style={styles.blockHeader}>
          <MaterialCommunityIcons name="alert-octagon-outline" size={16} color={Colors.warning} />
          <Text style={[styles.blockTitle, { color: Colors.warning }]}>
            POINTS OF FRICTION & WEAKNESSES ({weaknesses.length})
          </Text>
        </View>

        <AppCard style={styles.card} glowColor={`${Colors.warning}26`}>
          {weaknesses.map((weakness, idx) => (
            <View key={`weakness-${idx}`} style={styles.listItem}>
              <View style={[styles.bulletCircle, { backgroundColor: `${Colors.warning}22` }]}>
                <MaterialCommunityIcons name="alert" size={12} color={Colors.warning} />
              </View>
              <Text style={styles.itemText}>{weakness}</Text>
            </View>
          ))}
        </AppCard>
      </View>

      {/* 3. IMPROVEMENT SUGGESTIONS */}
      <View style={styles.block}>
        <View style={styles.blockHeader}>
          <MaterialCommunityIcons name="lightning-bolt" size={16} color={Colors.primary} />
          <Text style={[styles.blockTitle, { color: Colors.primary }]}>
            HIGH-LEVERAGE IMPROVEMENT PROTOCOLS
          </Text>
        </View>

        <AppCard style={styles.card} glowColor={`${Colors.primary}26`}>
          {suggestions.map((suggestion, idx) => (
            <View key={`suggestion-${idx}`} style={styles.suggestionItem}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNumber}>0{idx + 1}</Text>
              </View>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          ))}
        </AppCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.lg,
  },
  block: {
    marginBottom: Layout.spacing.lg,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Layout.spacing.sm,
  },
  blockTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  card: {
    padding: Layout.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  bulletCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: Layout.radius.sm,
    backgroundColor: `${Colors.primary}22`,
    borderWidth: 1,
    borderColor: `${Colors.primary}44`,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    fontWeight: '500',
  },
});
