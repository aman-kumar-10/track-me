import { UserProfile, DailyEntryFormData, DisciplineScores } from '../types';

export interface FullExportPayload {
  exportDate: string;
  appVersion: string;
  userProfile: UserProfile;
  latestScores: DisciplineScores;
  dailyEntries: Record<string, DailyEntryFormData>;
}

export class ExportService {
  /**
   * Generate structured JSON backup
   */
  static generateJsonExport(
    profile: UserProfile,
    scores: DisciplineScores,
    entries: Record<string, DailyEntryFormData> = {}
  ): string {
    const payload: FullExportPayload = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
      userProfile: profile,
      latestScores: scores,
      dailyEntries: entries,
    };

    return JSON.stringify(payload, null, 2);
  }

  /**
   * Generate CSV format for spreadsheet export
   */
  static generateCsvExport(entries: DailyEntryFormData[]): string {
    const headers = [
      'Date',
      'WakeUpTime',
      'WakeUpOptimal',
      'WaterMl',
      'WorkoutDay',
      'WorkoutCompleted',
      'WorkoutMinutes',
      'Breakfast',
      'Lunch',
      'Dinner',
      'NoJunkFood',
      'OfficeStatus',
      'StudyMinutes',
      'TotalExpenses',
    ];

    const rows = entries.map((e) => {
      const totalExp = e.expenses.reduce((sum, item) => sum + item.amount, 0);
      return [
        e.date,
        `${e.wakeUpTime} ${e.wakeUpAmPm}`,
        e.wakeUpCompleted ? 'YES' : 'NO',
        e.waterMl,
        e.selectedDayIndex,
        e.workoutCompleted ? 'YES' : 'NO',
        e.workoutMinutes,
        e.breakfast ? 'YES' : 'NO',
        e.lunch ? 'YES' : 'NO',
        e.dinner ? 'YES' : 'NO',
        e.noJunkFood ? 'YES' : 'NO',
        e.officeStatus,
        e.studyMinutes,
        totalExp.toFixed(2),
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}
