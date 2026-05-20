export class ExerciseRecordDTO {
  maxWeight: number;
  maxReps: number;
  bestWeight: number;
  bestReps: number;
  maxVolume: number;
  estimatedOneRepMax: number;
  exerciseId: string;
  exerciseTitle: string;

  constructor(
    maxWeight: number,
    maxReps: number,
    bestWeight: number,
    bestReps: number,
    maxVolume: number,
    exerciseId: string,
    exerciseTitle: string,
  ) {
    this.maxWeight = maxWeight;
    this.maxReps = maxReps;
    this.bestWeight = bestWeight;
    this.bestReps = bestReps;
    this.maxVolume = maxVolume;
    this.estimatedOneRepMax = ExerciseRecordDTO.calcOneRepMax(
      bestWeight,
      bestReps,
    );
    this.exerciseId = exerciseId;
    this.exerciseTitle = exerciseTitle;
  }

  static calcOneRepMax(weight: number, reps: number): number {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
  }

  static calcUpdates(
    current: {
      maxWeight: number;
      maxReps: number;
      bestWeight: number;
      bestReps: number;
      maxVolume: number;
    },
    newWeight: number,
    newReps: number,
  ): Partial<{
    maxWeight: number;
    maxReps: number;
    bestWeight: number;
    bestReps: number;
    maxVolume: number;
  }> | null {
    const updates: Partial<{
      maxWeight: number;
      maxReps: number;
      bestWeight: number;
      bestReps: number;
      maxVolume: number;
    }> = {};

    const newVolume = newWeight * newReps;
    const newOneRepMax = ExerciseRecordDTO.calcOneRepMax(newWeight, newReps);
    const currentOneRepMax = ExerciseRecordDTO.calcOneRepMax(
      current.bestWeight,
      current.bestReps,
    );

    if (newWeight > current.maxWeight) {
      updates.maxWeight = newWeight;
      updates.maxReps = newReps;
    }

    if (newOneRepMax > currentOneRepMax) {
      updates.bestWeight = newWeight;
      updates.bestReps = newReps;
    }

    if (newVolume > current.maxVolume) {
      updates.maxVolume = newVolume;
    }

    return Object.keys(updates).length > 0 ? updates : null;
  }
}
