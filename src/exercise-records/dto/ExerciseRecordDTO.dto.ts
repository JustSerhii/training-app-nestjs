export class ExerciseRecordDTO {
  maxWeight: number;
  maxReps: number;
  maxVolume: number;
  estimatedOneRepMax: number;

  constructor(weight: number, reps: number) {
    this.maxWeight = weight;
    this.maxReps = reps;
    this.maxVolume = weight * reps;
    this.estimatedOneRepMax = ExerciseRecordDTO.calcOneRepMax(weight, reps);
  }

  static calcOneRepMax(weight: number, reps: number): number {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
  }

  static calcUpdates(
    current: { maxWeight: number; maxReps: number; maxVolume: number },
    newWeight: number,
    newReps: number,
  ): Partial<{ maxWeight: number; maxReps: number; maxVolume: number }> | null {
    const updates: Partial<{
      maxWeight: number;
      maxReps: number;
      maxVolume: number;
    }> = {};

    const newVolume = newWeight * newReps;
    const newOneRepMax = ExerciseRecordDTO.calcOneRepMax(newWeight, newReps);
    const currentOneRepMax = ExerciseRecordDTO.calcOneRepMax(
      current.maxWeight,
      current.maxReps,
    );

    if (newWeight > current.maxWeight) {
      updates.maxWeight = newWeight;
      updates.maxReps = newReps;
    }

    if (newVolume > current.maxVolume) {
      updates.maxVolume = newVolume;
    }

    if (newOneRepMax > currentOneRepMax && !updates.maxWeight) {
      updates.maxWeight = newWeight;
      updates.maxReps = newReps;
    }

    return Object.keys(updates).length > 0 ? updates : null;
  }
}
