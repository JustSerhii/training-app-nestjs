import { Prisma } from '@prisma/client';
import { SET_SELECT } from 'src/sets';

export const WORKOUT_EXERCISE_SELECT = {
  id: true,
  description: true,
  workoutId: true,
  order: true,
  exercise: {
    select: {
      id: true,
      title: true,
      muscleGroups: true,
    },
  },
  sets: {
    select: {
      ...SET_SELECT,
    },
    orderBy: {
      order: 'asc',
    },
  },
} satisfies Prisma.WorkoutExerciseSelect;
