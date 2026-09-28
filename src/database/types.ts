export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          age: number;
          height_cm: number;
          weight_kg: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string | null;
          age?: number;
          height_cm?: number;
          weight_kg?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          age?: number;
          height_cm?: number;
          weight_kg?: number;
          updated_at?: string;
        };
      };
      daily_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          wake_up_time: string;
          wake_up_am_pm: string;
          wake_up_completed: boolean;
          water_ml: number;
          selected_day_index: number;
          workout_completed: boolean;
          workout_minutes: number;
          breakfast: boolean;
          lunch: boolean;
          dinner: boolean;
          no_junk_food: boolean;
          office_status: 'Office' | 'Leave' | 'Weekend';
          study_minutes: number;
          study_notes: string;
          best_moment: string;
          regret_of_day: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_date: string;
          wake_up_time?: string;
          wake_up_am_pm?: string;
          wake_up_completed?: boolean;
          water_ml?: number;
          selected_day_index?: number;
          workout_completed?: boolean;
          workout_minutes?: number;
          breakfast?: boolean;
          lunch?: boolean;
          dinner?: boolean;
          no_junk_food?: boolean;
          office_status?: 'Office' | 'Leave' | 'Weekend';
          study_minutes?: number;
          study_notes?: string;
          best_moment?: string;
          regret_of_day?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entry_date?: string;
          wake_up_time?: string;
          wake_up_am_pm?: string;
          wake_up_completed?: boolean;
          water_ml?: number;
          selected_day_index?: number;
          workout_completed?: boolean;
          workout_minutes?: number;
          breakfast?: boolean;
          lunch?: boolean;
          dinner?: boolean;
          no_junk_food?: boolean;
          office_status?: 'Office' | 'Leave' | 'Weekend';
          study_minutes?: number;
          study_notes?: string;
          best_moment?: string;
          regret_of_day?: string;
          updated_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          daily_entry_id: string | null;
          user_id: string;
          amount: number;
          description: string;
          expense_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          daily_entry_id?: string | null;
          user_id: string;
          amount: number;
          description: string;
          expense_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          daily_entry_id?: string | null;
          user_id?: string;
          amount?: number;
          description?: string;
          expense_date?: string;
        };
      };
      daily_scores: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          wake_up_score: number;
          water_score: number;
          workout_score: number;
          food_score: number;
          study_score: number;
          financial_score: number;
          overall_score: number;
          streak_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_date: string;
          wake_up_score?: number;
          water_score?: number;
          workout_score?: number;
          food_score?: number;
          study_score?: number;
          financial_score?: number;
          overall_score?: number;
          streak_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entry_date?: string;
          wake_up_score?: number;
          water_score?: number;
          workout_score?: number;
          food_score?: number;
          study_score?: number;
          financial_score?: number;
          overall_score?: number;
          streak_count?: number;
          updated_at?: string;
        };
      };
      weekly_reports: {
        Row: {
          id: string;
          user_id: string;
          week_start_date: string;
          week_end_date: string;
          summary: string;
          wins: Json;
          weaknesses: Json;
          suggestions: Json;
          avg_discipline_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start_date: string;
          week_end_date: string;
          summary: string;
          wins?: Json;
          weaknesses?: Json;
          suggestions?: Json;
          avg_discipline_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start_date?: string;
          week_end_date?: string;
          summary?: string;
          wins?: Json;
          weaknesses?: Json;
          suggestions?: Json;
          avg_discipline_score?: number;
        };
      };
    };
  };
}
