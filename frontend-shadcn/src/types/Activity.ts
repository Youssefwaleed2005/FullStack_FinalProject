export type ActivityDay = {
  date: string; // "2026-11-08"
  count: number;
};

export type LearnerActivity = {
  days: ActivityDay[];
  currentStreak: number;
  longestStreak: number;
  totalActions: number;
};
