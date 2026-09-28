export interface WorkoutDaySchedule {
  dayName: string;
  targetMuscles: string;
  isRest: boolean;
  defaultMinutes: number;
}

export const WORKOUT_SCHEDULE: Record<number, WorkoutDaySchedule> = {
  1: { dayName: 'Monday', targetMuscles: 'Chest + Triceps', isRest: false, defaultMinutes: 60 },
  2: { dayName: 'Tuesday', targetMuscles: 'Back + Biceps', isRest: false, defaultMinutes: 60 },
  3: { dayName: 'Wednesday', targetMuscles: 'Shoulders + Arms', isRest: false, defaultMinutes: 60 },
  4: { dayName: 'Thursday', targetMuscles: 'Chest + Triceps', isRest: false, defaultMinutes: 60 },
  5: { dayName: 'Friday', targetMuscles: 'Back + Biceps', isRest: false, defaultMinutes: 60 },
  6: { dayName: 'Saturday', targetMuscles: 'Legs', isRest: false, defaultMinutes: 60 },
  0: { dayName: 'Sunday', targetMuscles: 'Rest', isRest: true, defaultMinutes: 0 },
};

export const getWorkoutForDay = (dayIndex: number): WorkoutDaySchedule => {
  return WORKOUT_SCHEDULE[dayIndex] || WORKOUT_SCHEDULE[0];
};
