import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateWorkoutDTO, UpdateWorkoutDTO, ViewWorkoutDTO } from './dto';
import { WORKOUT_SELECT } from './workouts.select';
import { WORKOUT_EXERCISE_SELECT } from 'src/workout-exercises';
import { ViewFullWorkoutDTO } from './dto/ViewFullWorkoutDTO.dto';

@Injectable()
export class WorkoutsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: CreateWorkoutDTO,
  ): Promise<ViewWorkoutDTO> {
    return this.prisma.workout.create({
      data: {
        ...data,
        userId,
      },
      select: WORKOUT_SELECT,
    });
  }

  async findMany(userId: string): Promise<ViewWorkoutDTO[]> {
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
  ): Promise<ViewWorkoutDTO | null> {
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
  ): Promise<ViewFullWorkoutDTO | null> {
    return this.prisma.workout.findFirst({
      where: { id: workoutId, userId },
      select: {
        ...WORKOUT_SELECT,
        workoutExercises: {
          select: WORKOUT_EXERCISE_SELECT,
          orderBy: { order: 'asc' },
        },
      },
    });
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
    data: UpdateWorkoutDTO,
  ): Promise<ViewWorkoutDTO> {
    return this.prisma.workout.update({
      where: {
        id: workoutId,
      },
      data,
      select: WORKOUT_SELECT,
    });
  }
}
