import { Prisma } from '@prisma/client';

export const SET_SELECT = {
  id: true,
  weight: true,
  order: true,
  reps: true,
  type: true,
  workoutExerciseId: true,
} satisfies Prisma.SetSelect;
