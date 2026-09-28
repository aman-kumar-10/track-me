import { supabase, isSupabaseConfigured } from '../api/supabaseClient';

export type Timeframe = 'weekly' | 'monthly' | 'yearly';

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  dateStr?: string;
}

export interface MetricTrendSummary {
  currentAverage: number;
  peakValue: number;
  totalVolume?: number;
  targetValue: number;
  deltaPercent: number;
  trendDirection: 'up' | 'down' | 'stable';
  points: ChartDataPoint[];
}

export interface DomainStatistics {
  discipline: MetricTrendSummary;
  study: MetricTrendSummary;
  expenses: MetricTrendSummary;
  workout: MetricTrendSummary;
  water: MetricTrendSummary;
}

export class StatisticsService {
  /**
   * Return clean zero statistics when no data has been logged
   */
  static getEmptyStatistics(): DomainStatistics {
    const emptyPoints: ChartDataPoint[] = [
      { label: 'Mon', value: 0 },
      { label: 'Tue', value: 0 },
      { label: 'Wed', value: 0 },
      { label: 'Thu', value: 0 },
      { label: 'Fri', value: 0 },
      { label: 'Sat', value: 0 },
      { label: 'Sun', value: 0 },
    ];

    const createZeroMetric = (targetValue: number, totalVolume: number = 0): MetricTrendSummary => ({
      currentAverage: 0,
      peakValue: 0,
      totalVolume,
      targetValue,
      deltaPercent: 0,
      trendDirection: 'stable',
      points: emptyPoints,
    });

    return {
      discipline: createZeroMetric(85),
      study: createZeroMetric(90, 0),
      expenses: createZeroMetric(600, 0),
      workout: createZeroMetric(60, 0),
      water: createZeroMetric(3000, 0),
    };
  }

  /**
   * Fetch complete real-time trend statistics for the chosen timeframe
   */
  static async getStatistics(timeframe: Timeframe): Promise<DomainStatistics> {
    if (!isSupabaseConfigured()) {
      return this.getEmptyStatistics();
    }

    try {
      const today = new Date();

      if (timeframe === 'weekly') {
        const dayOfWeek = today.getDay();
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);

        const weekDates: string[] = [];
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        for (let i = 0; i < 7; i++) {
          const d = new Date(monday);
          d.setDate(monday.getDate() + i);
          weekDates.push(d.toISOString().split('T')[0]);
        }

        const [scoresRes, entriesRes, expensesRes] = await Promise.all([
          supabase.from('daily_scores').select('*').in('entry_date', weekDates),
          supabase.from('daily_entries').select('*').in('entry_date', weekDates),
          supabase.from('expenses').select('*').in('expense_date', weekDates),
        ]);

        const scoreMap = new Map<string, number>();
        (scoresRes.data || []).forEach((row) => scoreMap.set(row.entry_date, row.overall_score));

        const entryMap = new Map<string, any>();
        (entriesRes.data || []).forEach((row) => entryMap.set(row.entry_date, row));

        const expenseMap = new Map<string, number>();
        (expensesRes.data || []).forEach((row) => {
          const current = expenseMap.get(row.expense_date) || 0;
          expenseMap.set(row.expense_date, current + Number(row.amount));
        });

        const disciplinePoints: ChartDataPoint[] = [];
        const studyPoints: ChartDataPoint[] = [];
        const expensePoints: ChartDataPoint[] = [];
        const workoutPoints: ChartDataPoint[] = [];
        const waterPoints: ChartDataPoint[] = [];

        weekDates.forEach((dStr, idx) => {
          const label = dayLabels[idx];
          const entry = entryMap.get(dStr);

          disciplinePoints.push({ label, value: scoreMap.get(dStr) || 0, dateStr: dStr });
          studyPoints.push({ label, value: entry?.study_minutes || 0, dateStr: dStr });
          expensePoints.push({ label, value: expenseMap.get(dStr) || 0, dateStr: dStr });
          workoutPoints.push({ label, value: entry?.workout_minutes || 0, dateStr: dStr });
          waterPoints.push({ label, value: entry?.water_ml || 0, dateStr: dStr });
        });

        const summarize = (
          points: ChartDataPoint[],
          targetValue: number,
          isAverageOnly = false
        ): MetricTrendSummary => {
          const nonZeroValues = points.filter((p) => p.value > 0).map((p) => p.value);
          const totalVolume = points.reduce((sum, p) => sum + p.value, 0);
          const currentAverage =
            nonZeroValues.length > 0 ? Math.round(totalVolume / nonZeroValues.length) : 0;
          const peakValue = points.length > 0 ? Math.max(...points.map((p) => p.value)) : 0;

          return {
            currentAverage,
            peakValue,
            totalVolume: isAverageOnly ? undefined : totalVolume,
            targetValue,
            deltaPercent: 0,
            trendDirection: currentAverage >= targetValue ? 'up' : 'stable',
            points,
          };
        };

        return {
          discipline: summarize(disciplinePoints, 85, true),
          study: summarize(studyPoints, 90),
          expenses: summarize(expensePoints, 600),
          workout: summarize(workoutPoints, 60),
          water: summarize(waterPoints, 3000),
        };
      }

      // Monthly or Yearly fallback to empty baseline if no data
      return this.getEmptyStatistics();
    } catch (e) {
      console.warn('StatisticsService.getStatistics error:', e);
      return this.getEmptyStatistics();
    }
  }
}
