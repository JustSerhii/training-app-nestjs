import { calculateSetWeight } from './calculate-set-weight';

export function calculateExerciseVolume(
  sets: Array<{ weight: number | null; reps: number }>,
  exerciseIsBodyWeight: boolean,
  userBodyWeight: number | null,
): number {
  return sets.reduce((total, set) => {
    const weight = calculateSetWeight(
      set.weight,
      exerciseIsBodyWeight,
      userBodyWeight,
    );
    return total + weight * set.reps;
  }, 0);
}
