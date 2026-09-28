import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants/theme';
import { WeeklyReportData, UserProfile } from '../types';
import { GeminiService, WeeklyMetricsPayload } from '../services/geminiService';
import { SupabaseService } from '../api/supabaseService';
import { supabase, isSupabaseConfigured } from '../api/supabaseClient';
import { ReportHeroCard } from '../components/report/ReportHeroCard';
import { ReportDomainPillars } from '../components/report/ReportDomainPillars';
import { ReportWinsWeaknesses } from '../components/report/ReportWinsWeaknesses';
import { AppCard } from '../components/common/AppCard';

interface WeeklyReportScreenProps {
  onBack?: () => void;
}

export const WeeklyReportScreen: React.FC<WeeklyReportScreenProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Operator',
    email: '',
    age: 25,
    heightCm: 178,
    weightKg: 72,
  });

  const [report, setReport] = useState<WeeklyReportData | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const fetchedProfile = await SupabaseService.fetchProfile();
        if (isMounted && fetchedProfile) {
          setProfile(fetchedProfile);
        }

        if (isSupabaseConfigured()) {
          const { data } = await supabase
            .from('weekly_reports')
            .select('*')
            .order('week_start_date', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (isMounted && data) {
            setReport({
              id: data.id,
              weekStartDate: data.week_start_date,
              weekEndDate: data.week_end_date,
              avgScore: Number(data.avg_discipline_score) || 0,
              summary: data.summary,
              disciplineAssessment: 'Circadian and hydration consistency evaluated.',
              fitnessAssessment: 'Training sessions and physical output evaluated.',
              learningAssessment: 'Deep work and focus blocks analyzed.',
              spendingAssessment: 'Financial outflows monitored.',
              wins: Array.isArray(data.wins) ? data.wins : [],
              weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
              suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
              createdAt: data.created_at,
            });
          }
        }
      } catch (err) {
        console.warn('Error loading weekly report data:', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);

    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const weekStartDate = monday.toISOString().split('T')[0];
    const weekEndDate = sunday.toISOString().split('T')[0];

    // Collect real logged entries from Supabase
    let daysLoggedCount = 0;
    let averageScore = 0;
    let wakeUpSuccessRate = 0;
    let waterGoalSuccessRate = 0;
    let workoutsCompletedCount = 0;
    let totalWorkoutMinutes = 0;
    let totalStudyMinutes = 0;
    let studyTopicsSummary: string[] = [];
    let totalExpenses = 0;
    let reflectionsHighlights: string[] = [];

    if (isSupabaseConfigured()) {
      try {
        const [scoresRes, entriesRes, expensesRes] = await Promise.all([
          supabase.from('daily_scores').select('*').gte('entry_date', weekStartDate).lte('entry_date', weekEndDate),
          supabase.from('daily_entries').select('*').gte('entry_date', weekStartDate).lte('entry_date', weekEndDate),
          supabase.from('expenses').select('*').gte('expense_date', weekStartDate).lte('expense_date', weekEndDate),
        ]);

        const scores = scoresRes.data || [];
        const entries = entriesRes.data || [];
        const expenses = expensesRes.data || [];

        daysLoggedCount = scores.length;
        if (daysLoggedCount > 0) {
          averageScore = Math.round(scores.reduce((sum, s) => sum + s.overall_score, 0) / daysLoggedCount);
        }

        const optimalWakeUps = entries.filter((e) => e.wake_up_completed).length;
        wakeUpSuccessRate = daysLoggedCount > 0 ? Math.round((optimalWakeUps / daysLoggedCount) * 100) : 0;

        const optimalHydration = entries.filter((e) => e.water_ml >= 3000).length;
        waterGoalSuccessRate = daysLoggedCount > 0 ? Math.round((optimalHydration / daysLoggedCount) * 100) : 0;

        const completedWorkouts = entries.filter((e) => e.workout_completed);
        workoutsCompletedCount = completedWorkouts.length;
        totalWorkoutMinutes = completedWorkouts.reduce((sum, e) => sum + (e.workout_minutes || 0), 0);

        totalStudyMinutes = entries.reduce((sum, e) => sum + (e.study_minutes || 0), 0);
        studyTopicsSummary = entries.map((e) => e.study_notes).filter(Boolean);

        totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
        reflectionsHighlights = entries.map((e) => e.best_moment).filter(Boolean);
      } catch (err) {
        console.warn('Error computing weekly metrics:', err);
      }
    }

    const payload: WeeklyMetricsPayload = {
      weekStartDate,
      weekEndDate,
      userProfile: profile,
      daysLoggedCount,
      averageScore,
      wakeUpSuccessRate,
      waterGoalSuccessRate,
      workoutsCompletedCount,
      totalWorkoutMinutes,
      totalStudyMinutes,
      studyTopicsSummary: studyTopicsSummary.slice(0, 5),
      totalExpenses,
      reflectionsHighlights: reflectionsHighlights.slice(0, 5),
    };

    try {
      const generated = await GeminiService.generateWeeklyReport(payload);
      setReport(generated);
      Alert.alert(
        'Gemini Intelligence Complete',
        'Sunday executive performance synthesis generated and saved to your permanent record.'
      );
    } catch {
      Alert.alert('Synthesis Error', 'Failed to generate AI report. Check your Gemini API connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerOverline}>SUNDAY EXECUTIVE AUDIT</Text>
          <Text style={styles.headerTitle}>Weekly AI Review</Text>
        </View>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={handleGenerateReport}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <MaterialCommunityIcons name="creation" size={18} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Main Report Body */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Model Meta Pill */}
        <View style={styles.modelMetaStrip}>
          <View style={styles.metaLeft}>
            <View style={styles.liveModelDot} />
            <Text style={styles.modelNameText}>
              {GeminiService.isConfigured() ? 'GEMINI 1.5 FLASH / ACTIVE' : 'GEMINI INTELLIGENCE ENGINE'}
            </Text>
          </View>
          <Text style={styles.modelScheduleText}>Sunday Executive Review</Text>
        </View>

        {report ? (
          <>
            {/* 1. Hero Score & Executive Summary */}
            <ReportHeroCard
              avgScore={report.avgScore}
              weekStartDate={report.weekStartDate}
              weekEndDate={report.weekEndDate}
              summary={report.summary}
            />

            {/* 2. 4 Domain Intelligence Pillars */}
            <ReportDomainPillars
              disciplineAssessment={report.disciplineAssessment}
              fitnessAssessment={report.fitnessAssessment}
              learningAssessment={report.learningAssessment}
              spendingAssessment={report.spendingAssessment}
            />

            {/* 3. Wins, Weaknesses, and Improvement Suggestions */}
            <ReportWinsWeaknesses
              wins={report.wins}
              weaknesses={report.weaknesses}
              suggestions={report.suggestions}
            />

            {/* Regenerate Action Banner */}
            <TouchableOpacity
              style={styles.reanalyzeBtn}
              onPress={handleGenerateReport}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#0F1117" />
              ) : (
                <>
                  <MaterialCommunityIcons name="creation" size={18} color="#0F1117" />
                  <Text style={styles.reanalyzeBtnText}>RE-ANALYZE WEEK WITH GEMINI</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <AppCard style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <MaterialCommunityIcons name="creation" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Weekly Report Generated Yet</Text>
            <Text style={styles.emptySubtitle}>
              Sunday executive performance reviews synthesize your logged habits, workouts, deep work sessions, and financial outflow into structured audits.
            </Text>

            <TouchableOpacity
              style={styles.generateBtn}
              onPress={handleGenerateReport}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#0F1117" />
              ) : (
                <>
                  <MaterialCommunityIcons name="creation" size={18} color="#0F1117" />
                  <Text style={styles.generateBtnText}>GENERATE AUDIT WITH GEMINI</Text>
                </>
              )}
            </TouchableOpacity>
          </AppCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerOverline: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.sm,
    backgroundColor: `${Colors.primary}18`,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl * 2,
  },
  modelMetaStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: Layout.spacing.md,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveModelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9D65FF',
  },
  modelNameText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
  },
  modelScheduleText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  reanalyzeBtn: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: Layout.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Layout.spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  reanalyzeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F1117',
    letterSpacing: 1,
  },
  emptyCard: {
    padding: Layout.spacing.xl,
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.primary}18`,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.md,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Layout.spacing.lg,
  },
  generateBtn: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: Layout.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.lg,
    gap: 8,
    width: '100%',
  },
  generateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F1117',
    letterSpacing: 0.8,
  },
});
