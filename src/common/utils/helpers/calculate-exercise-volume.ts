export function calculateExerciseVolume(
  sets: Array<{ weight: number | null; reps: number }>,
): number {
  return sets.reduce((total, set) => {
    const weight = set.weight ?? 0;
    return total + weight * set.reps;
  }, 0);
}
