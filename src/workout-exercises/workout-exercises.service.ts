import { PrismaService } from 'src/prisma';
import {
  CreateWorkoutExerciseDTO,
  ViewWorkoutExerciseDTO,
  UpdateWorkoutExerciseDTO,
} from './dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WORKOUT_EXERCISE_SELECT } from './workout-exercise.select';

const WOKOURT_EXERCISE_NOT_FOUND = 'no workout exercise found';

@Injectable()
export class WorkoutExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertWorkoutOwner(
    userId: string,
    workoutId: string,
  ): Promise<void> {
    const workout = await this.prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
      },
    });

    if (!workout) throw new ForbiddenException();
  }

  async createWorkoutExercise(
    userId: string,
    workoutId: string,
    data: CreateWorkoutExerciseDTO,
  ): Promise<ViewWorkoutExerciseDTO> {
    await this.assertWorkoutOwner(userId, workoutId);

    const lastWorkoutExercise = await this.prisma.workoutExercise.findFirst({
      where: {
        workoutId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const order = lastWorkoutExercise ? lastWorkoutExercise.order + 1 : 1;

    return await this.prisma.workoutExercise.create({
      data: {
        description: data.description,
        workoutId: workoutId,
        exerciseId: data.exerciseId,
        order,
      },
      select: WORKOUT_EXERCISE_SELECT,
    });
  }

  async getWorkoutExercise(
    userId: string,
    workoutId: string,
    workoutExerciseId: string,
  ): Promise<ViewWorkoutExerciseDTO> {
    await this.assertWorkoutOwner(userId, workoutId);

    const workoutExercise = await this.prisma.workoutExercise.findUnique({
      where: {
        id: workoutExerciseId,
      },
      select: WORKOUT_EXERCISE_SELECT,
    });
    if (!workoutExercise)
      throw new NotFoundException(WOKOURT_EXERCISE_NOT_FOUND);
    return workoutExercise;
  }

  async getWorkoutExercises(
    userId: string,
    workoutId: string,
  ): Promise<ViewWorkoutExerciseDTO[]> {
    await this.assertWorkoutOwner(userId, workoutId);
    return this.prisma.workoutExercise.findMany({
      where: {
        workoutId,
      },
      select: WORKOUT_EXERCISE_SELECT,
      orderBy: { order: 'asc' },
    });
  }

  async updateWorkoutExercise(
    userId: string,
    workoutId: string,
    workoutExerciseId: string,
    data: UpdateWorkoutExerciseDTO,
  ): Promise<ViewWorkoutExerciseDTO> {
    await this.assertWorkoutOwner(userId, workoutId);
    const workoutExercise = await this.prisma.workoutExercise.findUnique({
      where: {
        id: workoutExerciseId,
      },
    });
    if (!workoutExercise)
      throw new NotFoundException(WOKOURT_EXERCISE_NOT_FOUND);
    return await this.prisma.workoutExercise.update({
      where: {
        id: workoutExerciseId,
      },
      data,
      select: WORKOUT_EXERCISE_SELECT,
    });
  }

  async deleteWorkoutExercise(
    userId: string,
    workoutId: string,
    workoutExerciseId: string,
  ): Promise<void> {
    await this.assertWorkoutOwner(userId, workoutId);

    const workoutExercise = await this.prisma.workoutExercise.findFirst({
      where: {
        id: workoutExerciseId,
        workoutId,
      },
    });
    if (!workoutExercise)
      throw new NotFoundException(WOKOURT_EXERCISE_NOT_FOUND);

    await this.prisma.workoutExercise.delete({
      where: {
        id: workoutExerciseId,
      },
    });
  }
}
