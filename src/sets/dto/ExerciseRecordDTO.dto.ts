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
  // static isNewRecord(
  //   current: { maxWeight: number; maxReps: number; maxVolume: number },
  //   newWeight: number,
  //   newReps: number,
  // ): boolean {
  //   const newVolume = newWeight * newReps;
  //   const newOneRepMax = ExerciseRecordDTO.calcOneRepMax(newWeight, newReps);
  //   const currentOneRepMax = ExerciseRecordDTO.calcOneRepMax(
  //     current.maxWeight,
  //     current.maxReps,
  //   );

  //   return (
  //     newWeight > current.maxWeight ||
  //     newVolume > current.maxVolume ||
  //     newOneRepMax > currentOneRepMax
  //   );
  // }

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

    // maxWeight оновлюється тільки якщо вага більша
    if (newWeight > current.maxWeight) {
      updates.maxWeight = newWeight;
      // maxReps оновлюється тільки разом з новим maxWeight
      updates.maxReps = newReps;
    }

    // volume оновлюється незалежно
    if (newVolume > current.maxVolume) {
      updates.maxVolume = newVolume;
    }

    // oneRepMax може оновити maxWeight/maxReps через кращу формулу
    if (newOneRepMax > currentOneRepMax && !updates.maxWeight) {
      updates.maxWeight = newWeight;
      updates.maxReps = newReps;
    }

    return Object.keys(updates).length > 0 ? updates : null;
  }
}
