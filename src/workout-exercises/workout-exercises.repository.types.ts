import { Prisma } from '@prisma/client';
import { WORKOUT_EXERCISE_SELECT } from './workout-exercise.select';

export type WorkoutExercisesEntity = Prisma.WorkoutExerciseGetPayload<{
  select: typeof WORKOUT_EXERCISE_SELECT;
}>;

export type CreateWorkoutExerciseData = {
  exerciseId: string;
  description?: string;
};

export type UpdateWorkoutExerciseData = Partial<
  Omit<CreateWorkoutExerciseData, 'exerciseId'>
>;
