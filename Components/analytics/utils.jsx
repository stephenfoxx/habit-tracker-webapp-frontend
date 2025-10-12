// utils.js
export function calculateSummaryStats(habits, activeBoxes) {
  const totalHabits = habits.length;
  const allBoxes = activeBoxes.flat();
  const completedCount = allBoxes.filter(Boolean).length;
  const totalBoxes = allBoxes.length || 1;

  const completionRate = Math.round((completedCount / totalBoxes) * 100);

  return {
    totalBoxes,
    totalHabits,
    completedCount,
    completionRate,
  };
}
