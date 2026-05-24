import { Injectable } from '@nestjs/common';
import { ExerciseRecordRepository } from './exercise-records.repository';
import { ExerciseRecordDTO } from './dto';
import { PrismaService } from 'src/prisma';
import { calculateSetWeight } from 'src/common/utils';

@Injectable()
export class ExerciseRecordsService {
  constructor(
    private readonly exerciseRecordsRepository: ExerciseRecordRepository,
    private readonly prisma: PrismaService,
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

    const [exercise, user] = await Promise.all([
      this.prisma.exercise.findUnique({
        where: { id: exerciseId },
        select: { isBodyWeight: true },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { bodyWeight: true },
      }),
    ]);

    const isBodyWeight = exercise?.isBodyWeight ?? false;
    const userBodyWeight = user?.bodyWeight ?? null;

    const newRecord = allSets.reduce(
      (best, set) => {
        const weight = calculateSetWeight(
          set.weight,
          isBodyWeight,
          userBodyWeight,
        );
        const volume = weight * set.reps;
        const oneRepMax = ExerciseRecordDTO.calcOneRepMax(weight, set.reps);
        const bestOneRepMax = ExerciseRecordDTO.calcOneRepMax(
          best.bestWeight,
          best.bestReps,
        );

        return {
          maxWeight: Math.max(best.maxWeight, weight),
          maxReps:
            weight >= best.maxWeight
              ? Math.max(best.maxReps, set.reps)
              : best.maxReps,
          bestWeight: oneRepMax > bestOneRepMax ? weight : best.bestWeight,
          bestReps: oneRepMax > bestOneRepMax ? set.reps : best.bestReps,
          maxVolume: Math.max(best.maxVolume, volume),
        };
      },
      { maxWeight: 0, maxReps: 0, bestWeight: 0, bestReps: 0, maxVolume: 0 },
    );

    await this.exerciseRecordsRepository.upsertRecord(
      userId,
      exerciseId,
      newRecord,
      newRecord,
    );
  }

  async getAllRecordsByUser(userId: string): Promise<ExerciseRecordDTO[]> {
    const records =
      await this.exerciseRecordsRepository.findAllRecordsByUser(userId);
    if (!records || records.length === 0) return [];

    return records.map((record) => {
      const title = record.exercise?.title ?? 'Unknown Exercise';

      return new ExerciseRecordDTO(
        record.maxWeight,
        record.maxReps,
        record.bestWeight,
        record.bestReps,
        record.maxVolume,
        record.exerciseId,
        title,
      );
    });
  }

  async updateOrDeleteRecord(
    userId: string,
    exerciseId: string,
    remainingSets: Array<{
      weight: number | null;
      reps: number;
      workoutExerciseId: string;
    }>,
  ) {
    if (remainingSets.length === 0) {
      await this.exerciseRecordsRepository.deleteRecord(userId, exerciseId);
    } else {
      await this.recalculateRecord(userId, exerciseId, remainingSets);
    }
  }
}
