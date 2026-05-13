import { Prisma } from '@prisma/client';
import { WORKOUT_EXERCISE_SELECT } from 'src/workout-exercises';

export const WORKOUT_SELECT = {
  id: true,
  title: true,
  description: true,
  createdAt: true,
} satisfies Prisma.WorkoutSelect;

export const FULL_WORKOUT_SELECT = {
  ...WORKOUT_SELECT,
  workoutExercises: {
    select: WORKOUT_EXERCISE_SELECT,
    orderBy: { order: 'asc' as const },
  },
} satisfies Prisma.WorkoutSelect;
