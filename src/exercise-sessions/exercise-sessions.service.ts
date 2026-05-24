import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { calculateExerciseVolume } from 'src/common/utils';
import { PrismaService } from 'src/prisma';

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
          sets: {
            select: { weight: true, reps: true },
          },
          exercise: {
            select: { id: true, isBodyWeight: true },
          },
        },
      });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { bodyWeight: true },
    });

    const setsByExercise = new Map<
      string,
      Array<{ weight: number | null; reps: number }>
    >();

    for (const we of workoutExercises) {
      const existing = setsByExercise.get(we.exerciseId) || [];
      setsByExercise.set(we.exerciseId, [...existing, ...we.sets]);
    }

    for (const [exerciseId, sets] of setsByExercise.entries()) {
      const workoutExercise = workoutExercises.find(
        (we) => we.exerciseId === exerciseId,
      );

      if (!workoutExercise?.exercise) {
        console.error(`Exercise not found for exerciseId: ${exerciseId}`);
        continue;
      }

      const volume = calculateExerciseVolume(
        sets,
        workoutExercise.exercise.isBodyWeight,
        user?.bodyWeight ?? null,
      );

      await this.prisma.exerciseSession.upsert({
        where: {
          workoutId_exerciseId: { workoutId, exerciseId },
        },
        update: { volume },
        create: {
          userId,
          workoutId,
          exerciseId,
          volume,
        },
      });
    }
  }

  async getExerciseVolumeHistory(
    userId: string,
    exerciseId: string,
    limit: number = 20,
  ): Promise<Array<{ workoutId: string; volume: number; createdAt: Date }>> {
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
}
