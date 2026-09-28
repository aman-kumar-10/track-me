import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { AppCard } from '../common/AppCard';

interface MealsSectionProps {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  noJunkFood: boolean;
  onToggleMeal: (field: 'breakfast' | 'lunch' | 'dinner' | 'noJunkFood') => void;
}

export const MealsSection: React.FC<MealsSectionProps> = ({
  breakfast,
  lunch,
  dinner,
  noJunkFood,
  onToggleMeal,
}) => {
  // Score: 3 pts per meal + 6 pts for no junk food = 15 max
  const mealCount = [breakfast, lunch, dinner].filter(Boolean).length;
  const foodScore = mealCount * 3 + (noJunkFood ? 6 : 0);

  return (
    <AppCard style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: `${Colors.success}1A` }]}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={18} color={Colors.success} />
          </View>
          <View>
            <Text style={styles.sectionTag}>SECTION D</Text>
            <Text style={styles.sectionTitle}>Meals & Nutrition</Text>
          </View>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>{foodScore} / 15 pts</Text>
        </View>
      </View>

      {/* 3 Main Meals Grid */}
      <Text style={styles.fieldLabel}>DAILY SCHEDULED MEALS</Text>
      <View style={styles.mealsRow}>
        {/* Breakfast */}
        <TouchableOpacity
          style={[styles.mealCard, breakfast && styles.mealCardChecked]}
          onPress={() => onToggleMeal('breakfast')}
          activeOpacity={0.75}
        >
          <View style={[styles.mealCheck, breakfast && styles.mealCheckActive]}>
            {breakfast && <MaterialCommunityIcons name="check" size={14} color="#0F1117" />}
          </View>
          <Text style={[styles.mealTitle, breakfast && styles.mealTitleActive]}>Breakfast</Text>
          <Text style={styles.mealSub}>+3 pts</Text>
        </TouchableOpacity>

        {/* Lunch */}
        <TouchableOpacity
          style={[styles.mealCard, lunch && styles.mealCardChecked]}
          onPress={() => onToggleMeal('lunch')}
          activeOpacity={0.75}
        >
          <View style={[styles.mealCheck, lunch && styles.mealCheckActive]}>
            {lunch && <MaterialCommunityIcons name="check" size={14} color="#0F1117" />}
          </View>
          <Text style={[styles.mealTitle, lunch && styles.mealTitleActive]}>Lunch</Text>
          <Text style={styles.mealSub}>+3 pts</Text>
        </TouchableOpacity>

        {/* Dinner */}
        <TouchableOpacity
          style={[styles.mealCard, dinner && styles.mealCardChecked]}
          onPress={() => onToggleMeal('dinner')}
          activeOpacity={0.75}
        >
          <View style={[styles.mealCheck, dinner && styles.mealCheckActive]}>
            {dinner && <MaterialCommunityIcons name="check" size={14} color="#0F1117" />}
          </View>
          <Text style={[styles.mealTitle, dinner && styles.mealTitleActive]}>Dinner</Text>
          <Text style={styles.mealSub}>+3 pts</Text>
        </TouchableOpacity>
      </View>

      {/* No Junk Food Discipline Checkbox */}
      <TouchableOpacity
        style={[
          styles.junkFoodCard,
          noJunkFood && styles.junkFoodCardChecked,
        ]}
        onPress={() => onToggleMeal('noJunkFood')}
        activeOpacity={0.8}
      >
        <View style={styles.junkFoodLeft}>
          <View style={[styles.shieldIcon, noJunkFood && styles.shieldIconActive]}>
            <MaterialCommunityIcons
              name={noJunkFood ? 'shield-check' : 'shield-outline'}
              size={20}
              color={noJunkFood ? Colors.success : Colors.textMuted}
            />
          </View>
          <View>
            <Text style={styles.junkFoodTitle}>Zero Junk Food Rule</Text>
            <Text style={styles.junkFoodSub}>
              {noJunkFood
                ? 'Strict dietary discipline maintained today'
                : 'Unchecked = refined sugar, processed snacks consumed'}
            </Text>
          </View>
        </View>

        <View style={[styles.junkBadge, noJunkFood && styles.junkBadgeActive]}>
          <Text style={[styles.junkBadgeText, noJunkFood && styles.junkBadgeTextActive]}>
            +6 pts
          </Text>
        </View>
      </TouchableOpacity>
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
    borderColor: `${Colors.success}33`,
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
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Layout.spacing.sm,
  },
  mealsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Layout.spacing.md,
  },
  mealCard: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Layout.spacing.md,
    alignItems: 'center',
  },
  mealCardChecked: {
    borderColor: `${Colors.success}40`,
    backgroundColor: '#12201D',
  },
  mealCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  mealCheckActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  mealTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  mealTitleActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  mealSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  junkFoodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Layout.spacing.md,
  },
  junkFoodCardChecked: {
    borderColor: `${Colors.success}40`,
    backgroundColor: '#12201D',
  },
  junkFoodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  shieldIcon: {
    width: 38,
    height: 38,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIconActive: {
    borderColor: `${Colors.success}40`,
    backgroundColor: `${Colors.success}1A`,
  },
  junkFoodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  junkFoodSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    paddingRight: 6,
  },
  junkBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  junkBadgeActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  junkBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  junkBadgeTextActive: {
    color: '#0F1117',
  },
});
