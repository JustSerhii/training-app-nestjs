export type ExerciseRecordInitital = {
  maxWeight: number;
  maxReps: number;
  maxVolume: number;
};

export type ExerciseRecordUpdate = Partial<ExerciseRecordInitital>;
