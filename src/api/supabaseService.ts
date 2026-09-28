import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  UserProfile,
  DailyEntryFormData,
  DisciplineScores,
  StreakInfo,
  WeekDayProgress,
} from '../types';
import { CalculatedScores } from '../services/scoringEngine';

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

// In-memory cache for offline-first resilience & instant UI responsiveness
const localCache: {
  profile: UserProfile;
  entries: Record<string, DailyEntryFormData>;
  scores: Record<string, CalculatedScores & { streak: number }>;
} = {
  profile: {
    name: 'Operator',
    email: '',
    age: 25,
    heightCm: 178,
    weightKg: 72,
  },
  entries: {},
  scores: {},
};

export class SupabaseService {
  /**
   * Helper to retrieve active user ID or default single-user ID
   */
  private static async getUserId(): Promise<string> {
    try {
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return user.id;
      }
    } catch {
      // Fall through to default
    }
    return DEFAULT_USER_ID;
  }

  /**
   * Fetch User Profile
   */
  static async fetchProfile(): Promise<UserProfile> {
    const userId = await this.getUserId();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data) {
          const profile: UserProfile = {
            name: data.name || 'Operator',
            email: data.email || '',
            age: data.age || 25,
            heightCm: Number(data.height_cm) || 178,
            weightKg: Number(data.weight_kg) || 72,
          };
          localCache.profile = profile;
          return profile;
        }
      } catch (err) {
        console.warn('Supabase fetchProfile failed, using local cache:', err);
      }
    }

    return localCache.profile;
  }

  /**
   * Update or Upsert User Profile
   */
  static async updateProfile(profile: UserProfile): Promise<boolean> {
    localCache.profile = profile;
    const userId = await this.getUserId();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('profiles').upsert({
          id: userId,
          name: profile.name,
          email: profile.email,
          age: profile.age,
          height_cm: profile.heightCm,
          weight_kg: profile.weightKg,
        });

        if (error) {
          console.error('Supabase updateProfile error:', error);
          return false;
        }
        return true;
      } catch (err) {
        console.error('Supabase updateProfile exception:', err);
        return false;
      }
    }

    return true;
  }

  /**
   * Save Daily Log, Expenses, and Calculated Scores
   */
  static async saveDailyEntry(
    entry: DailyEntryFormData,
    scores: CalculatedScores
  ): Promise<{ success: boolean; error?: string }> {
    const userId = await this.getUserId();
    const entryDate = entry.date;

    // Cache locally immediately so UI is always responsive
    localCache.entries[entryDate] = entry;
    localCache.scores[entryDate] = { ...scores, streak: 1 };

    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      // 1. Upsert Daily Entry
      const { data: entryData, error: entryError } = await supabase
        .from('daily_entries')
        .upsert(
          {
            user_id: userId,
            entry_date: entryDate,
            wake_up_time: entry.wakeUpTime,
            wake_up_am_pm: entry.wakeUpAmPm,
            wake_up_completed: entry.wakeUpCompleted,
            water_ml: entry.waterMl,
            selected_day_index: entry.selectedDayIndex,
            workout_completed: entry.workoutCompleted,
            workout_minutes: entry.workoutMinutes,
            breakfast: entry.breakfast,
            lunch: entry.lunch,
            dinner: entry.dinner,
            no_junk_food: entry.noJunkFood,
            office_status: entry.officeStatus,
            study_minutes: entry.studyMinutes,
            study_notes: entry.studyNotes,
            best_moment: entry.bestMoment,
            regret_of_day: entry.regretOfDay,
          },
          { onConflict: 'user_id,entry_date' }
        )
        .select('id')
        .single();

      if (entryError) {
        console.error('Error saving daily_entry to Supabase:', entryError);
        return { success: false, error: entryError.message };
      }

      const dailyEntryId = entryData?.id;

      // 2. Save Expenses if any
      if (entry.expenses.length > 0) {
        await supabase
          .from('expenses')
          .delete()
          .eq('user_id', userId)
          .eq('expense_date', entryDate);

        const expenseRows = entry.expenses.map((exp) => ({
          daily_entry_id: dailyEntryId || null,
          user_id: userId,
          amount: exp.amount,
          description: exp.description,
          expense_date: entryDate,
        }));

        const { error: expError } = await supabase.from('expenses').insert(expenseRows);
        if (expError) {
          console.error('Error saving expenses to Supabase:', expError);
        }
      } else {
        // If expenses were cleared, delete previous records for today
        await supabase
          .from('expenses')
          .delete()
          .eq('user_id', userId)
          .eq('expense_date', entryDate);
      }

      // 3. Upsert Daily Scores
      const { error: scoreError } = await supabase.from('daily_scores').upsert(
        {
          user_id: userId,
          entry_date: entryDate,
          wake_up_score: scores.wakeUpScore,
          water_score: scores.waterScore,
          workout_score: scores.workoutScore,
          food_score: scores.foodScore,
          study_score: scores.studyScore,
          financial_score: scores.financialScore,
          overall_score: scores.overallScore,
          streak_count: 1,
        },
        { onConflict: 'user_id,entry_date' }
      );

      if (scoreError) {
        console.error('Error saving daily_scores to Supabase:', scoreError);
        return { success: false, error: scoreError.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error('Exception during Supabase saveDailyEntry:', err);
      return { success: false, error: err?.message || 'Network or connection error' };
    }
  }

  /**
   * Fetch Daily Entry for a specific date
   */
  static async fetchDailyEntry(dateStr: string): Promise<DailyEntryFormData | null> {
    if (isSupabaseConfigured()) {
      try {
        const userId = await this.getUserId();
        const { data: entry, error } = await supabase
          .from('daily_entries')
          .select('*, expenses(*)')
          .eq('user_id', userId)
          .eq('entry_date', dateStr)
          .maybeSingle();

        if (!error && entry) {
          const loadedEntry: DailyEntryFormData = {
            date: entry.entry_date,
            wakeUpTime: entry.wake_up_time || '05:45',
            wakeUpAmPm: (entry.wake_up_am_pm as 'AM' | 'PM') || 'AM',
            wakeUpCompleted: Boolean(entry.wake_up_completed),
            waterMl: entry.water_ml || 0,
            selectedDayIndex: entry.selected_day_index ?? new Date().getDay(),
            workoutCompleted: Boolean(entry.workout_completed),
            workoutMinutes: entry.workout_minutes || 0,
            breakfast: Boolean(entry.breakfast),
            lunch: Boolean(entry.lunch),
            dinner: Boolean(entry.dinner),
            noJunkFood: Boolean(entry.no_junk_food),
            officeStatus: entry.office_status || 'Office',
            studyMinutes: entry.study_minutes || 0,
            studyNotes: entry.study_notes || '',
            bestMoment: entry.best_moment || '',
            regretOfDay: entry.regret_of_day || '',
            expenses: ((entry as any).expenses || []).map((e: any) => ({
              id: e.id,
              amount: Number(e.amount),
              description: e.description,
            })),
          };

          localCache.entries[dateStr] = loadedEntry;
          return loadedEntry;
        }
      } catch (err) {
        console.warn('Error fetching daily entry from Supabase:', err);
      }
    }

    if (localCache.entries[dateStr]) {
      return localCache.entries[dateStr];
    }

    return null;
  }

  /**
   * Fetch Discipline Scores & History
   */
  static async fetchScoresHistory(limit: number = 30): Promise<DisciplineScores> {
    const todayDate = new Date().toISOString().split('T')[0];
    let dataRows: { entry_date: string; overall_score: number }[] = [];

    if (isSupabaseConfigured()) {
      try {
        const userId = await this.getUserId();
        const { data, error } = await supabase
          .from('daily_scores')
          .select('entry_date, overall_score')
          .eq('user_id', userId)
          .order('entry_date', { ascending: false })
          .limit(limit);

        if (!error && data && data.length > 0) {
          dataRows = data;
        }
      } catch (err) {
        console.warn('Error fetching scores from Supabase:', err);
      }
    }

    // Merge in local cache for today if not already present
    if (localCache.scores[todayDate] && !dataRows.find((d) => d.entry_date === todayDate)) {
      dataRows.unshift({
        entry_date: todayDate,
        overall_score: localCache.scores[todayDate].overallScore,
      });
    }

    if (dataRows.length > 0) {
      const todayEntry = dataRows.find((d) => d.entry_date === todayDate);
      const todayScore = todayEntry ? todayEntry.overall_score : 0;

      const weeklySum = dataRows.slice(0, 7).reduce((acc, curr) => acc + curr.overall_score, 0);
      const weeklyAvg = Math.round(weeklySum / Math.min(dataRows.length, 7));

      const monthlySum = dataRows.reduce((acc, curr) => acc + curr.overall_score, 0);
      const monthlyAvg = Math.round(monthlySum / dataRows.length);

      return {
        today: todayScore,
        weekly: weeklyAvg,
        monthly: monthlyAvg,
        trend: weeklyAvg >= 80 ? 'up' : weeklyAvg >= 50 ? 'stable' : 'down',
        weeklyChangePercent: 0,
      };
    }

    // Zero-state when no data logged yet
    return {
      today: 0,
      weekly: 0,
      monthly: 0,
      trend: 'stable',
      weeklyChangePercent: 0,
    };
  }

  /**
   * Helper to calculate streak from logged dates
   */
  private static calculateStreakFromDates(dates: string[]): {
    currentStreak: number;
    bestStreak: number;
    monthlyConsistency: number;
  } {
    if (!dates || dates.length === 0) {
      return { currentStreak: 0, bestStreak: 0, monthlyConsistency: 0 };
    }

    const uniqueSorted = Array.from(new Set(dates)).sort();
    const dateSet = new Set(uniqueSorted);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Current Streak: Starts if today is logged, OR if yesterday is logged (streak active pending today's log)
    let currentStreak = 0;
    let checkDate: Date | null = dateSet.has(todayStr)
      ? new Date(now)
      : dateSet.has(yesterdayStr)
      ? new Date(yesterday)
      : null;

    if (checkDate) {
      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (dateSet.has(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Best Streak
    let bestStreak = 0;
    let tempStreak = 0;
    let prevTime: number | null = null;

    for (const dStr of uniqueSorted) {
      const time = new Date(dStr + 'T00:00:00Z').getTime();
      if (prevTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((time - prevTime) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      prevTime = time;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    }

    // Monthly Consistency (% of days logged in the last 30 days)
    let past30Count = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const str = d.toISOString().split('T')[0];
      if (dateSet.has(str)) past30Count++;
    }
    const monthlyConsistency = Math.round((past30Count / 30) * 100);

    return {
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak),
      monthlyConsistency,
    };
  }

  /**
   * Fetch Streak & Consistency data for Dashboard based on real entries
   */
  static async fetchStreakData(): Promise<StreakInfo> {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const weekDays: WeekDayProgress[] = [];
    const dayLabels: ('M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S')[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    let loggedDates: string[] = [];
    const scoreMap = new Map<string, number>();

    if (isSupabaseConfigured()) {
      try {
        const userId = await this.getUserId();
        const { data } = await supabase
          .from('daily_scores')
          .select('entry_date, overall_score')
          .eq('user_id', userId)
          .order('entry_date', { ascending: false })
          .limit(60);

        if (data && data.length > 0) {
          loggedDates = data.map((d) => d.entry_date);
          data.forEach((d) => scoreMap.set(d.entry_date, d.overall_score));
        }
      } catch (err) {
        console.warn('Error fetching streak scores from Supabase:', err);
      }
    }

    // Include local cache entries
    Object.keys(localCache.entries).forEach((dateStr) => {
      if (!scoreMap.has(dateStr)) {
        loggedDates.push(dateStr);
        scoreMap.set(dateStr, localCache.scores[dateStr]?.overallScore || 0);
      }
    });

    const streakStats = this.calculateStreakFromDates(loggedDates);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      const isToday = dStr === todayStr;
      const isFuture = d > today && !isToday;
      const completed = scoreMap.has(dStr);

      weekDays.push({
        dayName: dayLabels[i],
        dateStr: dStr,
        completed,
        score: scoreMap.get(dStr) || 0,
        isToday,
        isFuture,
      });
    }

    return {
      currentStreak: streakStats.currentStreak,
      bestStreak: streakStats.bestStreak,
      monthlyConsistency: streakStats.monthlyConsistency,
      weekDays,
    };
  }

  /**
   * Save Weekly Report from Gemini
   */
  static async saveWeeklyReport(report: {
    weekStartDate: string;
    weekEndDate: string;
    summary: string;
    wins: string[];
    weaknesses: string[];
    suggestions: string[];
    avgScore: number;
  }): Promise<boolean> {
    const userId = await this.getUserId();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('weekly_reports').upsert(
          {
            user_id: userId,
            week_start_date: report.weekStartDate,
            week_end_date: report.weekEndDate,
            summary: report.summary,
            wins: report.wins,
            weaknesses: report.weaknesses,
            suggestions: report.suggestions,
            avg_discipline_score: report.avgScore,
          },
          { onConflict: 'user_id,week_start_date' }
        );

        if (error) {
          console.error('Error saving weekly report to Supabase:', error);
          return false;
        }
        return true;
      } catch (err) {
        console.error('Exception saving weekly report:', err);
        return false;
      }
    }

    return true;
  }
}
