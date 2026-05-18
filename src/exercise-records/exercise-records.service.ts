import { Injectable } from '@nestjs/common';
import { ExerciseRecordRepository } from './exercise-records.repository';

@Injectable()
export class ExerciseRecordsService {
  constructor(
    private readonly exerciseRecordsRepository: ExerciseRecordRepository,
  ) {}

  async recalculateRecord(
    userId: string,
    exerciseId: string,
    allSets: { weight: number | null; reps: number }[],
  ): Promise<void> {
    if (allSets.length === 0) {
      await this.exerciseRecordsRepository.deleteRecord(userId, exerciseId);
      return;
    }

    const newRecord = allSets.reduce(
      (best, set) => {
        const weight = set.weight ?? 0;
        const volume = weight * set.reps;
        return {
          maxWeight: Math.max(best.maxWeight, weight),
          maxReps:
            weight >= best.maxWeight
              ? Math.max(best.maxReps, set.reps)
              : best.maxReps,
          maxVolume: Math.max(best.maxVolume, volume),
        };
      },
      { maxWeight: 0, maxReps: 0, maxVolume: 0 },
    );

    await this.exerciseRecordsRepository.upsertRecord(
      userId,
      exerciseId,
      newRecord,
      newRecord,
    );
  }
}
