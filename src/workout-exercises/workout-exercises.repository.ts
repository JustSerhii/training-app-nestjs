import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { WORKOUT_EXERCISE_SELECT } from './workout-exercise.select';
import { ReorderWorkoutExercisesDTO } from './dto';
import { CursorPageOptionsDto } from 'src/common/dto/cursor-pagination';
import { CursorPaginationResult } from 'src/common/types';
import {
  CreateWorkoutExerciseData,
  UpdateWorkoutExerciseData,
  WorkoutExercisesEntity,
} from './workout-exercises.repository.types';

@Injectable()
export class WorkoutsExercisesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    workoutExerciseId: string,
  ): Promise<WorkoutExercisesEntity | null> {
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
  ): Promise<WorkoutExercisesEntity | null> {
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

  async findMany(workoutId: string): Promise<WorkoutExercisesEntity[]> {
    return this.prisma.workoutExercise.findMany({
      where: {
        workoutId,
      },
      select: WORKOUT_EXERCISE_SELECT,
      orderBy: { order: 'asc' },
    });
  }

  async findManyPaginatedByCursor(
    workoutId: string,
    options: CursorPageOptionsDto,
  ): Promise<CursorPaginationResult<WorkoutExercisesEntity>> {
    const { limit, afterCursor: afterId } = options;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.workoutExercise.findMany({
        where: {
          workoutId,
        },
        take: limit + 1,
        skip: afterId ? 1 : 0,
        cursor: afterId ? { id: afterId } : undefined,
        orderBy: { order: 'asc' },
        select: WORKOUT_EXERCISE_SELECT,
      }),

      this.prisma.workoutExercise.count({
        where: {
          workoutId,
        },
      }),
    ]);

    const hasNextPage = items.length > limit;

    if (hasNextPage) {
      items.pop();
    }

    const lastId = items.length > 0 ? items[items.length - 1].id : null;

    return { data: items, lastId, total, hasNextPage };
  }

  async create(
    workoutId: string,
    data: CreateWorkoutExerciseData,
    order: number,
  ): Promise<WorkoutExercisesEntity> {
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
    data: UpdateWorkoutExerciseData,
  ): Promise<WorkoutExercisesEntity> {
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
  ): Promise<WorkoutExercisesEntity[]> {
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
