import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants/theme';
import {
  UserProfile,
  DisciplineScores,
  StreakInfo,
  ProgressCardData,
} from '../types';
import { ProfileStatsHeader } from '../components/dashboard/ProfileStatsHeader';
import { DisciplineGauge } from '../components/dashboard/DisciplineGauge';
import { StreakWidget } from '../components/dashboard/StreakWidget';
import { ProgressGridCard } from '../components/dashboard/ProgressGridCard';
import { SupabaseService } from '../api/supabaseService';
import { calculateDailyScores } from '../services/scoringEngine';
import { getWorkoutForDay } from '../constants/workoutSchedule';
import { checkIsWakeUpOptimal } from '../components/entry/WakeUpSection';

interface DashboardScreenProps {
  onNavigateToEntry?: (category?: string) => void;
  onNavigateToStats?: () => void;
  onNavigateToSettings?: () => void;
  refreshTrigger?: number;
}

const createDefaultCards = (dayIndex: number): ProgressCardData[] => {
  const dayPlan = getWorkoutForDay(dayIndex);
  return [
    {
      id: 'wake_up',
      title: 'Wake Up',
      categoryTag: 'CIRCADIAN RHYTHM',
      iconName: 'weather-sunset-up',
      targetDisplay: '05:30 - 06:00 AM',
      currentDisplay: 'Not logged',
      percentage: 0,
      isCompleted: false,
      subLabel: 'Rule: 5:30 - 6:00 AM • Tap to record',
      accentColor: Colors.warning,
    },
    {
      id: 'water',
      title: 'Hydration',
      categoryTag: 'METABOLISM',
      iconName: 'cup-water',
      targetDisplay: '3,000 ml',
      currentDisplay: '0 ml',
      percentage: 0,
      isCompleted: false,
      subLabel: '3,000 ml remaining to hit target',
      accentColor: Colors.primary,
    },
    {
      id: 'workout',
      title: `Workout (${dayPlan.targetMuscles})`,
      categoryTag: 'PHYSICAL CONDITIONING',
      iconName: 'dumbbell',
      targetDisplay: `${dayPlan.defaultMinutes || 60} mins`,
      currentDisplay: '0 mins',
      percentage: 0,
      isCompleted: false,
      subLabel: `${dayPlan.targetMuscles} scheduled • Tap to log`,
      accentColor: Colors.danger,
    },
    {
      id: 'food',
      title: 'Nutrition & Diet',
      categoryTag: 'FUEL & DISCIPLINE',
      iconName: 'silverware-fork-knife',
      targetDisplay: '3 Clean Meals',
      currentDisplay: '0/3 Meals',
      percentage: 0,
      isCompleted: false,
      subLabel: 'No meals recorded yet today',
      accentColor: Colors.success,
    },
    {
      id: 'study',
      title: 'Deep Work & Study',
      categoryTag: 'INTELLECTUAL',
      iconName: 'book-open-page-variant-outline',
      targetDisplay: '90 mins',
      currentDisplay: '0 mins',
      percentage: 0,
      isCompleted: false,
      subLabel: '90 mins remaining',
      accentColor: '#9D65FF',
    },
    {
      id: 'finance',
      title: 'Daily Expenses',
      categoryTag: 'FINANCIAL CONTROL',
      iconName: 'currency-inr',
      targetDisplay: 'Discipline Mode',
      currentDisplay: '₹0',
      percentage: 0,
      isCompleted: false,
      subLabel: 'No expenses recorded today',
      accentColor: '#00C896',
    },
  ];
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToEntry,
  onNavigateToStats,
  onNavigateToSettings,
  refreshTrigger = 0,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const todayDayIndex = new Date().getDay();

  // User Profile
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Operator',
    email: '',
    age: 25,
    heightCm: 178,
    weightKg: 72,
  });

  // Discipline Scores
  const [scores, setScores] = useState<DisciplineScores>({
    today: 0,
    weekly: 0,
    monthly: 0,
    trend: 'stable',
    weeklyChangePercent: 0,
  });

  // Streak Information
  const [streak, setStreak] = useState<StreakInfo>({
    currentStreak: 0,
    bestStreak: 0,
    monthlyConsistency: 0,
    weekDays: [],
  });

  // 6 Core Progress Cards
  const [cards, setCards] = useState<ProgressCardData[]>(() => createDefaultCards(todayDayIndex));

  // Load Real Data from Supabase / Local Persistence
  const loadLiveData = useCallback(async () => {
    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const dayIndex = new Date().getDay();
      const dayPlan = getWorkoutForDay(dayIndex);

      const [fetchedProfile, todayEntry, scoreHistory, streakInfo] = await Promise.all([
        SupabaseService.fetchProfile(),
        SupabaseService.fetchDailyEntry(todayDate),
        SupabaseService.fetchScoresHistory(),
        SupabaseService.fetchStreakData(),
      ]);

      if (fetchedProfile) {
        setProfile(fetchedProfile);
      }

      if (streakInfo) {
        setStreak(streakInfo);
      }

      if (todayEntry) {
        const calculated = calculateDailyScores(todayEntry);
        setScores({
          today: calculated.overallScore,
          weekly: scoreHistory.weekly || calculated.overallScore,
          monthly: scoreHistory.monthly || calculated.overallScore,
          trend: calculated.overallScore >= 80 ? 'up' : calculated.overallScore >= 50 ? 'stable' : 'down',
          weeklyChangePercent: scoreHistory.weeklyChangePercent || 0,
        });

        const totalExpenses = todayEntry.expenses.reduce((sum, item) => sum + item.amount, 0);
        const isOptimal = checkIsWakeUpOptimal(todayEntry.wakeUpTime, todayEntry.wakeUpAmPm);
        const mealCount = [todayEntry.breakfast, todayEntry.lunch, todayEntry.dinner].filter(Boolean).length;

        setCards([
          {
            id: 'wake_up',
            title: 'Wake Up',
            categoryTag: 'CIRCADIAN RHYTHM',
            iconName: 'weather-sunset-up',
            targetDisplay: '05:30 - 06:00 AM',
            currentDisplay: todayEntry.wakeUpCompleted ? `${todayEntry.wakeUpTime} ${todayEntry.wakeUpAmPm}` : 'Not logged',
            percentage: todayEntry.wakeUpCompleted ? (isOptimal ? 100 : 50) : 0,
            isCompleted: todayEntry.wakeUpCompleted && isOptimal,
            subLabel: todayEntry.wakeUpCompleted
              ? (isOptimal ? 'Woke up inside optimal window (+15 pts)' : 'Outside 5:30 - 6:00 AM window (0 pts)')
              : 'Rule: 5:30 - 6:00 AM • Tap to record',
            accentColor: Colors.warning,
          },
          {
            id: 'water',
            title: 'Hydration',
            categoryTag: 'METABOLISM',
            iconName: 'cup-water',
            targetDisplay: '3,000 ml',
            currentDisplay: `${todayEntry.waterMl} ml`,
            percentage: Math.min(Math.round((todayEntry.waterMl / 3000) * 100), 100),
            isCompleted: todayEntry.waterMl >= 3000,
            subLabel: todayEntry.waterMl >= 3000
              ? 'Daily 3,000 ml hydration achieved'
              : `${Math.max(3000 - todayEntry.waterMl, 0)} ml remaining to hit target`,
            accentColor: Colors.primary,
          },
          {
            id: 'workout',
            title: `Workout (${dayPlan.targetMuscles})`,
            categoryTag: 'PHYSICAL CONDITIONING',
            iconName: 'dumbbell',
            targetDisplay: `${dayPlan.defaultMinutes || 60} mins`,
            currentDisplay: `${todayEntry.workoutMinutes} mins`,
            percentage: todayEntry.workoutCompleted ? 100 : 0,
            isCompleted: todayEntry.workoutCompleted,
            subLabel: todayEntry.workoutCompleted
              ? `${dayPlan.targetMuscles} completed`
              : `${dayPlan.targetMuscles} scheduled • Tap to log`,
            accentColor: Colors.danger,
          },
          {
            id: 'food',
            title: 'Nutrition & Diet',
            categoryTag: 'FUEL & DISCIPLINE',
            iconName: 'silverware-fork-knife',
            targetDisplay: '3 Clean Meals',
            currentDisplay: `${mealCount}/3 Meals${todayEntry.noJunkFood ? ' • Clean' : ''}`,
            percentage: Math.round((calculated.foodScore / 15) * 100),
            isCompleted: calculated.foodScore === 15,
            subLabel: mealCount > 0
              ? (todayEntry.noJunkFood ? 'Zero junk food maintained today' : 'Refined sugar / snacks consumed (-6 pts)')
              : 'No meals recorded yet today',
            accentColor: Colors.success,
          },
          {
            id: 'study',
            title: 'Deep Work & Study',
            categoryTag: 'INTELLECTUAL',
            iconName: 'book-open-page-variant-outline',
            targetDisplay: '90 mins',
            currentDisplay: `${todayEntry.studyMinutes} mins`,
            percentage: Math.min(Math.round((todayEntry.studyMinutes / 90) * 100), 100),
            isCompleted: todayEntry.studyMinutes >= 90,
            subLabel: todayEntry.studyMinutes >= 90
              ? '90m intellectual quota reached (+20 pts)'
              : `${Math.max(90 - todayEntry.studyMinutes, 0)} mins remaining`,
            accentColor: '#9D65FF',
          },
          {
            id: 'finance',
            title: 'Daily Expenses',
            categoryTag: 'FINANCIAL CONTROL',
            iconName: 'currency-inr',
            targetDisplay: 'Discipline Mode',
            currentDisplay: `₹${totalExpenses.toFixed(0)}`,
            percentage: todayEntry.expenses.length > 0 ? 100 : 0,
            isCompleted: todayEntry.expenses.length > 0,
            subLabel: todayEntry.expenses.length > 0
              ? `${todayEntry.expenses.length} transaction(s) recorded`
              : 'No expenses recorded today',
            accentColor: '#00C896',
          },
        ]);
      } else {
        // No log for today yet: Show professional clean zero state
        setScores({
          today: 0,
          weekly: scoreHistory.weekly || 0,
          monthly: scoreHistory.monthly || 0,
          trend: scoreHistory.trend || 'stable',
          weeklyChangePercent: scoreHistory.weeklyChangePercent || 0,
        });
        setCards(createDefaultCards(dayIndex));
      }
    } catch (err) {
      console.warn('Dashboard loadLiveData error:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        await loadLiveData();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [loadLiveData, refreshTrigger]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLiveData();
    setRefreshing(false);
  }, [loadLiveData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* 1. Profile & Biometrics Header */}
        <ProfileStatsHeader
          profile={profile}
          onOpenProfile={() => onNavigateToSettings?.()}
          onOpenSettings={() => onNavigateToSettings?.()}
        />

        {/* 2. Main Discipline Score Hero Card */}
        <DisciplineGauge scores={scores} />

        {/* 3. Consistency & Streak Strip */}
        <View style={styles.sectionSpacer}>
          <StreakWidget streak={streak} />
        </View>

        {/* 4. Section Header for Daily Progress Cards */}
        <View style={styles.cardsHeaderRow}>
          <View>
            <Text style={styles.cardsSectionOverline}>DAILY EXECUTION</Text>
            <Text style={styles.cardsSectionTitle}>Domain Performance</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigateToEntry?.()}
            style={styles.quickEntryHeaderBtn}
          >
            <MaterialCommunityIcons name="plus" size={16} color={Colors.primary} />
            <Text style={styles.quickEntryBtnText}>Log Entry</Text>
          </TouchableOpacity>
        </View>

        {/* 5. The 6 Required Progress Cards */}
        <View style={styles.cardsGrid}>
          {cards.map((card) => (
            <ProgressGridCard
              key={card.id}
              card={card}
              onPress={() => onNavigateToEntry?.(card.id)}
            />
          ))}
        </View>

        {/* 6. Bottom Linear-Style Action Bar */}
        <View style={styles.bottomCtaContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.primaryCtaButton}
            onPress={() => onNavigateToEntry?.()}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={20} color="#0F1117" />
            <Text style={styles.primaryCtaText}>{"OPEN TODAY'S DAILY LOG"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.xxl * 2,
  },
  sectionSpacer: {
    marginTop: Layout.spacing.lg,
  },
  cardsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
  },
  cardsSectionOverline: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
    letterSpacing: -0.3,
  },
  quickEntryHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.primary}18`,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Layout.radius.sm,
  },
  quickEntryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  cardsGrid: {
    gap: 4,
  },
  bottomCtaContainer: {
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  primaryCtaButton: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: Layout.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1117',
    letterSpacing: 1,
  },
});
