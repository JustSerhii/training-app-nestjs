import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { WORKOUT_EXERCISE_SELECT } from './workout-exercise.select';
import {
  CreateWorkoutExerciseDTO,
  ReorderWorkoutExercisesDTO,
  UpdateWorkoutExerciseDTO,
  ViewWorkoutExerciseDTO,
} from './dto';

@Injectable()
export class WorkoutsExercisesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    workoutExerciseId: string,
  ): Promise<ViewWorkoutExerciseDTO | null> {
    return this.prisma.workoutExercise.findUnique({
      where: {
        id: workoutExerciseId,
      },
      select: WORKOUT_EXERCISE_SELECT,
    });
  }

  async findFirst(
    workoutId: string,
    workoutExerciseId: string,
  ): Promise<ViewWorkoutExerciseDTO | null> {
    return this.prisma.workoutExercise.findFirst({
      where: {
        workoutId,
        id: workoutExerciseId,
      },
      select: WORKOUT_EXERCISE_SELECT,
    });
  }

  async findLastOne(workoutId: string): Promise<{ order: number } | null> {
    return this.prisma.workoutExercise.findFirst({
      where: {
        workoutId,
      },
      orderBy: {
        order: 'desc',
      },
      select: { order: true },
    });
  }

  async findMany(workoutId: string): Promise<ViewWorkoutExerciseDTO[]> {
    return this.prisma.workoutExercise.findMany({
      where: {
        workoutId,
      },
      select: WORKOUT_EXERCISE_SELECT,
      orderBy: { order: 'asc' },
    });
  }

  async create(
    workoutId: string,
    data: CreateWorkoutExerciseDTO,
    order: number,
  ): Promise<ViewWorkoutExerciseDTO> {
    return this.prisma.workoutExercise.create({
      data: {
        description: data.description,
        workoutId: workoutId,
        exerciseId: data.exerciseId,
        order,
      },
      select: WORKOUT_EXERCISE_SELECT,
    });
  }

  async update(
    workoutExerciseId: string,
    data: UpdateWorkoutExerciseDTO,
  ): Promise<ViewWorkoutExerciseDTO> {
    return this.prisma.workoutExercise.update({
      where: {
        id: workoutExerciseId,
      },
      data,
      select: WORKOUT_EXERCISE_SELECT,
    });
  }

  async deleteOne(
    workoutId: string,
    workoutExerciseId: string,
  ): Promise<number> {
    const toDelete = await this.prisma.workoutExercise.findFirst({
      where: {
        workoutId,
        id: workoutExerciseId,
      },
      select: {
        order: true,
      },
    });

    if (!toDelete) return 0;
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.workoutExercise.deleteMany({
        where: {
          workoutId,
          id: workoutExerciseId,
        },
      });
      if (count > 0) {
        await tx.workoutExercise.updateMany({
          where: {
            workoutId,
            order: { gt: toDelete.order },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      }
      return count;
    });
  }

  async existsByOwner(
    userId: string,
    workoutExerciseId: string,
  ): Promise<boolean> {
    const workoutExercise = await this.prisma.workoutExercise.findFirst({
      where: {
        id: workoutExerciseId,
        workout: { userId },
      },
      select: {
        id: true,
      },
    });
    return !!workoutExercise;
  }

  async reorder(
    workoutId: string,
    data: ReorderWorkoutExercisesDTO,
  ): Promise<ViewWorkoutExerciseDTO[]> {
    return this.prisma.$transaction(
      data.workoutExercisesIds.map((id, index) =>
        this.prisma.workoutExercise.update({
          where: {
            id,
            workoutId,
          },
          data: { order: index + 1 },
          select: WORKOUT_EXERCISE_SELECT,
        }),
      ),
    );
  }
}
