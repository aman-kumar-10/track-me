import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants/theme';
import { DailyEntryFormData, OfficeStatus } from '../types';
import { calculateDailyScores } from '../services/scoringEngine';
import { SupabaseService } from '../api/supabaseService';

// Sub-sections
import { WakeUpSection } from '../components/entry/WakeUpSection';
import { WaterSection } from '../components/entry/WaterSection';
import { WorkoutSection } from '../components/entry/WorkoutSection';
import { MealsSection } from '../components/entry/MealsSection';
import { OfficeSection } from '../components/entry/OfficeSection';
import { ExpensesSection } from '../components/entry/ExpensesSection';
import { StudySection } from '../components/entry/StudySection';
import { ReflectionSection } from '../components/entry/ReflectionSection';

interface DailyEntryScreenProps {
  onBack?: () => void;
  onSave?: (data: DailyEntryFormData) => void;
  onSaveSuccess?: () => void;
}

export const DailyEntryScreen: React.FC<DailyEntryScreenProps> = ({
  onBack,
  onSave,
  onSaveSuccess,
}) => {
  const todayDayIndex = new Date().getDay();
  const todayDateStr = new Date().toISOString().split('T')[0];

  const [saving, setSaving] = useState(false);

  // Form State initialized to clean empty defaults (No dummy data)
  const [formData, setFormData] = useState<DailyEntryFormData>({
    date: todayDateStr,
    wakeUpTime: '05:45',
    wakeUpAmPm: 'AM',
    wakeUpCompleted: false,

    waterMl: 0,

    selectedDayIndex: todayDayIndex,
    workoutCompleted: false,
    workoutMinutes: 0,

    breakfast: false,
    lunch: false,
    dinner: false,
    noJunkFood: false,

    officeStatus: 'Office',

    expenses: [],

    studyMinutes: 0,
    studyNotes: '',

    bestMoment: '',
    regretOfDay: '',
  });

  // Load today's existing entry if previously saved (e.g. earlier this morning)
  useEffect(() => {
    let isMounted = true;
    async function loadTodayEntry() {
      try {
        const existing = await SupabaseService.fetchDailyEntry(todayDateStr);
        if (isMounted && existing) {
          setFormData(existing);
        }
      } catch (err) {
        console.warn('Error loading today entry in DailyEntryScreen:', err);
      }
    }
    loadTodayEntry();
    return () => {
      isMounted = false;
    };
  }, [todayDateStr]);

  // Calculate live scores
  const scores = calculateDailyScores(formData);

  const getScoreColor = (score: number) => {
    if (score === 0) return Colors.textMuted;
    if (score >= 80) return Colors.success;
    if (score >= 60) return Colors.primary;
    if (score >= 40) return Colors.warning;
    return Colors.danger;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await SupabaseService.saveDailyEntry(formData, scores);
      setSaving(false);

      if (result.success) {
        Alert.alert(
          'Daily Log Saved',
          `Performance Score: ${scores.overallScore}/100 points registered and synchronized with database.`,
          [
            {
              text: 'View Dashboard',
              onPress: () => {
                onSave?.(formData);
                onSaveSuccess?.();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Saved Locally (Database Notice)',
          `Entry saved to device memory, but Supabase returned: ${result.error || 'Connection error'}.\n\nPlease run fix_supabase.sql in your Supabase SQL Editor if permissions need to be updated.`,
          [
            {
              text: 'Continue to Dashboard',
              onPress: () => {
                onSave?.(formData);
                onSaveSuccess?.();
              },
            },
          ]
        );
      }
    } catch (err: any) {
      setSaving(false);
      Alert.alert('Save Error', err?.message || 'Failed to save daily log.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Top Fixed Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerOverline}>SYSTEM LOG ENTRY</Text>
          <Text style={styles.headerTitle}>Daily Execution Record</Text>
        </View>

        {/* Live Score Counter Pill */}
        <View style={[styles.liveScorePill, { borderColor: `${getScoreColor(scores.overallScore)}40` }]}>
          <View
            style={[
              styles.liveScoreDot,
              { backgroundColor: getScoreColor(scores.overallScore) },
            ]}
          />
          <Text style={[styles.liveScoreText, { color: getScoreColor(scores.overallScore) }]}>
            {scores.overallScore}
          </Text>
          <Text style={styles.liveScoreMax}>/100</Text>
        </View>
      </View>

      {/* Scrollable Entry Form */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* A) Wake Up */}
        <WakeUpSection
          wakeUpTime={formData.wakeUpTime}
          wakeUpAmPm={formData.wakeUpAmPm}
          onChangeTime={(time, amPm) =>
            setFormData((prev) => ({
              ...prev,
              wakeUpTime: time,
              wakeUpAmPm: amPm,
              wakeUpCompleted: true,
            }))
          }
        />

        {/* B) Water Tracker */}
        <WaterSection
          waterMl={formData.waterMl}
          onAddWater={(delta) =>
            setFormData((prev) => ({
              ...prev,
              waterMl: Math.max(0, prev.waterMl + delta),
            }))
          }
          onResetWater={() =>
            setFormData((prev) => ({
              ...prev,
              waterMl: 0,
            }))
          }
        />

        {/* C) Workout */}
        <WorkoutSection
          selectedDayIndex={formData.selectedDayIndex}
          workoutCompleted={formData.workoutCompleted}
          workoutMinutes={formData.workoutMinutes}
          onSelectDay={(dayIndex) =>
            setFormData((prev) => ({
              ...prev,
              selectedDayIndex: dayIndex,
            }))
          }
          onToggleCompleted={(completed) =>
            setFormData((prev) => ({
              ...prev,
              workoutCompleted: completed,
            }))
          }
          onChangeMinutes={(minutes) =>
            setFormData((prev) => ({
              ...prev,
              workoutMinutes: minutes,
            }))
          }
        />

        {/* D) Meals */}
        <MealsSection
          breakfast={formData.breakfast}
          lunch={formData.lunch}
          dinner={formData.dinner}
          noJunkFood={formData.noJunkFood}
          onToggleMeal={(field) =>
            setFormData((prev) => ({
              ...prev,
              [field]: !prev[field],
            }))
          }
        />

        {/* E) Office */}
        <OfficeSection
          officeStatus={formData.officeStatus}
          onSelectStatus={(status: OfficeStatus) =>
            setFormData((prev) => ({
              ...prev,
              officeStatus: status,
            }))
          }
        />

        {/* F) Expenses */}
        <ExpensesSection
          expenses={formData.expenses}
          onAddExpense={(amount, description) =>
            setFormData((prev) => ({
              ...prev,
              expenses: [
                ...prev.expenses,
                { id: Date.now().toString(), amount, description },
              ],
            }))
          }
          onRemoveExpense={(id) =>
            setFormData((prev) => ({
              ...prev,
              expenses: prev.expenses.filter((e) => e.id !== id),
            }))
          }
        />

        {/* G) Study */}
        <StudySection
          studyMinutes={formData.studyMinutes}
          studyNotes={formData.studyNotes}
          onChangeMinutes={(mins) =>
            setFormData((prev) => ({
              ...prev,
              studyMinutes: mins,
            }))
          }
          onChangeNotes={(notes) =>
            setFormData((prev) => ({
              ...prev,
              studyNotes: notes,
            }))
          }
        />

        {/* H) Reflection */}
        <ReflectionSection
          bestMoment={formData.bestMoment}
          regretOfDay={formData.regretOfDay}
          onChangeBestMoment={(text) =>
            setFormData((prev) => ({
              ...prev,
              bestMoment: text,
            }))
          }
          onChangeRegret={(text) =>
            setFormData((prev) => ({
              ...prev,
              regretOfDay: text,
            }))
          }
        />

        {/* Bottom Spacing */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Sticky Bottom Save Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#0F1117" />
          ) : (
            <MaterialCommunityIcons name="check-all" size={20} color="#0F1117" />
          )}
          <Text style={styles.saveBtnText}>
            {saving ? 'SAVING TO DATABASE...' : `SAVE DAILY LOG • ${scores.overallScore} PTS`}
          </Text>
        </TouchableOpacity>
      </View>
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
  liveScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
  },
  liveScoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveScoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  liveScoreMax: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${Colors.background}F2`,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: Layout.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1117',
    letterSpacing: 1,
  },
});
