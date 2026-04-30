import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDTO, UpdateWorkoutDTO, ViewWorkoutDTO } from './dto';
import { PrismaService } from 'src/prisma';
import { WORKOUT_EXERCISE_SELECT } from 'src/workout-exercises';
import { ViewFullWorkoutDTO } from './dto/ViewFullWorkoutDTO.dto';

const WORKOUT_NOT_FOUND = 'workout not found';
const WORKOUT_SELECT = {
  id: true,
  title: true,
  description: true,
  createdAt: true,
} as const;

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkout(
    userId: string,
    data: CreateWorkoutDTO,
  ): Promise<ViewWorkoutDTO> {
    const workout = await this.prisma.workout.create({
      data: {
        ...data,
        userId,
      },
      select: WORKOUT_SELECT,
    });
    return workout;
  }

  async getWorkouts(userId: string): Promise<ViewWorkoutDTO[]> {
    return await this.prisma.workout.findMany({
      where: {
        userId,
      },
      select: WORKOUT_SELECT,
    });
  }

  async getWorkout(userId: string, workoutId: string): Promise<ViewWorkoutDTO> {
    const workout = await this.prisma.workout.findFirst({
      where: {
        userId,
        id: workoutId,
      },
      select: WORKOUT_SELECT,
    });

    if (!workout) throw new NotFoundException(WORKOUT_NOT_FOUND);
    return workout;
  }

  async getFullWorkout(
    userId: string,
    workoutId: string,
  ): Promise<ViewFullWorkoutDTO> {
    const workout = await this.prisma.workout.findFirst({
      where: { id: workoutId, userId },
      select: {
        ...WORKOUT_SELECT,
        workoutExercises: {
          select: WORKOUT_EXERCISE_SELECT,
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!workout) throw new NotFoundException(WORKOUT_NOT_FOUND);
    return workout;
  }

  async deleteWorkout(userId: string, workoutId: string): Promise<void> {
    const workout = await this.prisma.workout.findFirst({
      where: {
        userId,
        id: workoutId,
      },
    });
    if (!workout) throw new NotFoundException(WORKOUT_NOT_FOUND);

    await this.prisma.workout.delete({
      where: {
        id: workoutId,
      },
    });
  }

  async updateWorkout(
    userId: string,
    workoutId: string,
    data: UpdateWorkoutDTO,
  ): Promise<ViewWorkoutDTO> {
    const workout = await this.prisma.workout.findFirst({
      where: {
        userId,
        id: workoutId,
      },
    });
    if (!workout) throw new NotFoundException(WORKOUT_NOT_FOUND);

    return await this.prisma.workout.update({
      where: { id: workoutId },
      data,
      select: WORKOUT_SELECT,
    });
  }
}
