import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { ProgressCardData } from '../../types';
import { AppCard } from '../common/AppCard';
import { ProgressBar } from '../common/ProgressBar';

interface ProgressGridCardProps {
  card: ProgressCardData;
  onPress?: () => void;
}

export const ProgressGridCard: React.FC<ProgressGridCardProps> = ({ card, onPress }) => {
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchableWrapper}
      >
        <AppCard
          style={styles.card}
          glowColor={card.isCompleted ? `${card.accentColor}40` : undefined}
        >
          {/* Top Header: Icon + Category Tag + Percentage */}
          <View style={styles.topRow}>
            <View style={styles.leftMeta}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: `${card.accentColor}18`,
                    borderColor: `${card.accentColor}33`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={card.iconName as any}
                  size={18}
                  color={card.accentColor}
                />
              </View>
              <View>
                <Text style={styles.categoryTag}>{card.categoryTag}</Text>
                <Text style={styles.title}>{card.title}</Text>
              </View>
            </View>

            <View
              style={[
                styles.percentBadge,
                card.isCompleted
                  ? { backgroundColor: `${Colors.success}1A`, borderColor: `${Colors.success}40` }
                  : { backgroundColor: Colors.surfaceSubtle, borderColor: Colors.cardBorder },
              ]}
            >
              {card.isCompleted ? (
                <MaterialCommunityIcons name="check" size={12} color={Colors.success} style={{ marginRight: 2 }} />
              ) : null}
              <Text
                style={[
                  styles.percentText,
                  { color: card.isCompleted ? Colors.success : Colors.textPrimary },
                ]}
              >
                {card.percentage}%
              </Text>
            </View>
          </View>

          {/* Middle Metric: Current / Target */}
          <View style={styles.metricRow}>
            <Text style={styles.currentValue}>{card.currentDisplay}</Text>
            <Text style={styles.targetValue}>/ {card.targetDisplay}</Text>
          </View>

          {/* Progress Bar */}
          <ProgressBar
            progress={card.percentage}
            color={card.accentColor}
            height={5}
            style={styles.progressBar}
          />

          {/* Bottom Sub-label / Status */}
          <View style={styles.bottomRow}>
            <Text style={styles.subLabel} numberOfLines={1}>
              {card.subLabel}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={16}
              color={Colors.textMuted}
            />
          </View>
        </AppCard>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touchableWrapper: {
    marginBottom: Layout.spacing.md,
  },
  card: {
    padding: Layout.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  percentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: Layout.spacing.sm,
    marginBottom: 6,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  targetValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  progressBar: {
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  subLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
});
