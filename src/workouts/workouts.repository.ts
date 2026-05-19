import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { FULL_WORKOUT_SELECT, WORKOUT_SELECT } from './workouts.select';
import {
  WorkoutEntity,
  FullWorkoutEntity,
  CreateWorkoutData,
  UpdateWorkoutData,
} from './workouts.repository.types';
import { PaginationDto } from 'src/common/dto/offset-pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkoutsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateWorkoutData,
  ): Promise<WorkoutEntity> {
    return this.prisma.workout.create({
      data: {
        ...data,
        userId,
      },
      select: WORKOUT_SELECT,
    });
  }

  async findMany(userId: string): Promise<WorkoutEntity[]> {
    return this.prisma.workout.findMany({
      where: {
        userId,
      },
      select: WORKOUT_SELECT,
    });
  }

  async findFirst(
    userId: string,
    workoutId: string,
  ): Promise<WorkoutEntity | null> {
    return this.prisma.workout.findFirst({
      where: {
        userId,
        id: workoutId,
      },
      select: WORKOUT_SELECT,
    });
  }

  async findFull(
    userId: string,
    workoutId: string,
  ): Promise<FullWorkoutEntity | null> {
    return this.prisma.workout.findFirst({
      where: { id: workoutId, userId },
      select: FULL_WORKOUT_SELECT,
    });
  }

  async findManyPaginated(
    userId: string,
    pagination: PaginationDto,
  ): Promise<{ data: WorkoutEntity[]; total: number }> {
    const where: Prisma.WorkoutWhereInput = { userId };

    if (pagination.search?.trim()) {
      where.OR = [
        { title: { contains: pagination.search.trim(), mode: 'insensitive' } },
        {
          description: {
            contains: pagination.search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.workout.findMany({
        where,
        select: WORKOUT_SELECT,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.workout.count({
        where,
      }),
    ]);
    return { data, total };
  }

  async deleteOne(userId: string, workoutId: string): Promise<number> {
    const { count } = await this.prisma.workout.deleteMany({
      where: {
        userId,
        id: workoutId,
      },
    });
    return count;
  }

  async update(
    workoutId: string,
    data: UpdateWorkoutData,
  ): Promise<WorkoutEntity> {
    return this.prisma.workout.update({
      where: {
        id: workoutId,
      },
      data,
      select: WORKOUT_SELECT,
    });
  }

  async findWorkoutExerciseIds(
    workoutId: string,
  ): Promise<{ id: string; exerciseId: string }[]> {
    return this.prisma.workoutExercise.findMany({
      where: { workoutId },
      select: { id: true, exerciseId: true },
    });
  }
}
