export interface UserProfile {
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
}

export interface DisciplineScores {
  today: number;     // 0 - 100
  weekly: number;    // 0 - 100
  monthly: number;   // 0 - 100
  trend: 'up' | 'down' | 'stable';
  weeklyChangePercent: number;
}

export interface WeekDayProgress {
  dayName: 'M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S';
  dateStr: string;
  completed: boolean;
  score: number;
  isToday: boolean;
  isFuture: boolean;
}

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  monthlyConsistency: number; // percentage, e.g. 88
  weekDays: WeekDayProgress[];
}

export type ProgressCategoryKey = 
  | 'wake_up'
  | 'water'
  | 'workout'
  | 'food'
  | 'study'
  | 'finance';

export interface ProgressCardData {
  id: ProgressCategoryKey;
  title: string;
  iconName: string;
  targetDisplay: string;
  currentDisplay: string;
  percentage: number; // 0 - 100
  isCompleted: boolean;
  subLabel: string;
  accentColor: string;
  categoryTag: string;
}

export interface DashboardState {
  profile: UserProfile;
  scores: DisciplineScores;
  streak: StreakInfo;
  cards: ProgressCardData[];
  lastUpdated: string;
}

export type OfficeStatus = 'Office' | 'Leave' | 'Weekend';

export interface ExpenseItem {
  id: string;
  amount: number;
  description: string;
}

export interface DailyEntryFormData {
  date: string;
  // A) Wake Up
  wakeUpTime: string; // e.g. "05:45"
  wakeUpAmPm: 'AM' | 'PM';
  wakeUpCompleted: boolean;

  // B) Water Tracker
  waterMl: number; // goal: 3000

  // C) Workout
  selectedDayIndex: number; // 0=Sun, 1=Mon, ..., 6=Sat
  workoutCompleted: boolean;
  workoutMinutes: number;

  // D) Meals
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  noJunkFood: boolean;

  // E) Office
  officeStatus: OfficeStatus;

  // F) Expenses
  expenses: ExpenseItem[];

  // G) Study
  studyMinutes: number; // goal: 90
  studyNotes: string;

  // H) Reflection
  bestMoment: string;
  regretOfDay: string;
}

export interface WeeklyReportData {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  avgScore: number;
  summary: string;
  disciplineAssessment: string;
  fitnessAssessment: string;
  learningAssessment: string;
  spendingAssessment: string;
  wins: string[];
  weaknesses: string[];
  suggestions: string[];
  createdAt: string;
}


