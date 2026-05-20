export type ExerciseRecordInitital = {
  maxWeight: number;
  maxReps: number;
  bestWeight: number;
  bestReps: number;
  maxVolume: number;
};

export type ExerciseRecordUpdate = Partial<ExerciseRecordInitital>;
