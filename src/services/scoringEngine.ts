import { DailyEntryFormData } from '../types';
import { checkIsWakeUpOptimal } from '../components/entry/WakeUpSection';
import { getWorkoutForDay } from '../constants/workoutSchedule';

export interface CalculatedScores {
  wakeUpScore: number;     // max 15
  waterScore: number;      // max 15
  workoutScore: number;    // max 20
  foodScore: number;       // max 15
  studyScore: number;      // max 20
  financialScore: number;  // max 15
  overallScore: number;    // max 100
}

export const calculateDailyScores = (entry: DailyEntryFormData): CalculatedScores => {
  // 1. Wake Up Score (15 pts) - Only if completed and within 5:30 - 6:00 AM window
  const isWakeUpOptimal = checkIsWakeUpOptimal(entry.wakeUpTime, entry.wakeUpAmPm);
  const wakeUpScore = (entry.wakeUpCompleted && isWakeUpOptimal) ? 15 : 0;

  // 2. Water Score (15 pts) - Goal: 3000 ml
  const waterRatio = Math.min((entry.waterMl || 0) / 3000, 1);
  const waterScore = Math.round(waterRatio * 15);

  // 3. Workout Score (20 pts)
  const dayPlan = getWorkoutForDay(entry.selectedDayIndex);
  let workoutScore = 0;
  if (dayPlan.isRest) {
    // Rest day auto award only if confirmed/completed
    workoutScore = entry.workoutCompleted ? 20 : 0;
  } else {
    if (entry.workoutCompleted) {
      workoutScore = 15;
      if (entry.workoutMinutes >= 45) {
        workoutScore += 5; // Bonus for duration
      }
    }
  }

  // 4. Food Score (15 pts) - 3 pts per meal + 6 pts for No Junk Food
  const mealCount = [entry.breakfast, entry.lunch, entry.dinner].filter(Boolean).length;
  // Award no junk food points if at least one clean meal logged or clean eating confirmed
  const foodScore = mealCount * 3 + (entry.noJunkFood ? 6 : 0);

  // 5. Study Score (20 pts) - Goal: 90 mins
  const studyRatio = Math.min((entry.studyMinutes || 0) / 90, 1);
  const studyScore = Math.round(studyRatio * 20);

  // 6. Financial Score (15 pts)
  // Award 15 points when expenses are tracked/recorded
  const financialScore = (entry.expenses && entry.expenses.length > 0) ? 15 : 0;

  const overallScore = Math.min(
    100,
    wakeUpScore + waterScore + workoutScore + foodScore + studyScore + financialScore
  );

  return {
    wakeUpScore,
    waterScore,
    workoutScore,
    foodScore,
    studyScore,
    financialScore,
    overallScore,
  };
};
