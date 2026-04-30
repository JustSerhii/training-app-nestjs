import { SetType } from '@prisma/client';

export class ViewSetDTO {
  id!: string;
  weight?: number | null;
  order!: number;
  reps!: number;
  type!: SetType;
  workoutExerciseId!: string;
}
