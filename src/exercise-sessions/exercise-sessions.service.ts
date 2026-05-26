import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { calculateExerciseVolume } from 'src/common/utils';
import { PrismaService } from 'src/prisma';
import { ExerciseVolumeDTO } from './dto';

type WorkoutExerciseWithSets = Prisma.WorkoutExerciseGetPayload<{
  include: {
    sets: { select: { weight: true; reps: true } };
    exercise: { select: { id: true; isBodyWeight: true } };
  };
}>;

@Injectable()
export class ExerciseSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async recalculateSessionsForWorkout(
    userId: string,
    workoutId: string,
  ): Promise<void> {
    const workoutExercises: WorkoutExerciseWithSets[] =
      await this.prisma.workoutExercise.findMany({
        where: { workoutId },
        include: {
          sets: { select: { weight: true, reps: true } },
          exercise: { select: { id: true, isBodyWeight: true } },
        },
      });

    const setsByExercise = new Map<
      string,
      Array<{ weight: number | null; reps: number }>
    >();
    for (const we of workoutExercises) {
      const existing = setsByExercise.get(we.exerciseId) || [];
      setsByExercise.set(we.exerciseId, [...existing, ...we.sets]);
    }

    const exerciseIdsInWorkout = new Set(
      workoutExercises.map((we) => we.exerciseId),
    );

    for (const exerciseId of exerciseIdsInWorkout) {
      const sets = setsByExercise.get(exerciseId) || [];

      const workoutExercise = workoutExercises.find(
        (we) => we.exerciseId === exerciseId,
      );

      if (!workoutExercise?.exercise) {
        console.error(`Exercise not found for exerciseId: ${exerciseId}`);
        continue;
      }

      if (sets.length === 0) {
        await this.prisma.exerciseSession.deleteMany({
          where: { workoutId, exerciseId },
        });
      } else {
        const volume = calculateExerciseVolume(sets);

        await this.prisma.exerciseSession.upsert({
          where: { workoutId_exerciseId: { workoutId, exerciseId } },
          update: { volume },
          create: { userId, workoutId, exerciseId, volume },
        });
      }
    }
  }

  async getExerciseVolumeHistory(
    userId: string,
    exerciseId: string,
    limit: number = 20,
  ): Promise<Array<ExerciseVolumeDTO>> {
    const history: Array<{
      workoutId: string;
      volume: number;
      createdAt: Date;
    }> = await this.prisma.exerciseSession.findMany({
      where: { userId, exerciseId },
      select: {
        workoutId: true,
        volume: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    return history;
  }

  async deleteSessionRecord(workoutId: string, exerciseId: string) {
    await this.prisma.exerciseSession.deleteMany({
      where: {
        workoutId,
        exerciseId,
      },
    });
  }

  async getWorkoutTotalVolume(workoutId: string): Promise<number> {
    const sessions = await this.prisma.exerciseSession.findMany({
      where: { workoutId },
      select: { volume: true },
    });
    return sessions.reduce((sum, s) => sum + s.volume, 0);
  }
}
