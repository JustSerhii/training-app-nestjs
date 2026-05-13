import { Prisma } from '@prisma/client';
import { WORKOUT_SELECT, FULL_WORKOUT_SELECT } from './workouts.select';

export type WorkoutEntity = Prisma.WorkoutGetPayload<{
  select: typeof WORKOUT_SELECT;
}>;

export type FullWorkoutEntity = Prisma.WorkoutGetPayload<{
  select: typeof FULL_WORKOUT_SELECT;
}>;

export type CreateWorkoutData = {
  title: string;
  description?: string;
};

export type UpdateWorkoutData = Partial<CreateWorkoutData>;

export type PaginationParams = {
  skip: number;
  take: number;
};
