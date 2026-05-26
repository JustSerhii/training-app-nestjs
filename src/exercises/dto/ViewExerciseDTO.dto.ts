import { MuscleGroup } from '@prisma/client';

export class ViewExerciseDTO {
  id!: string;
  title!: string;
  muscleGroups!: MuscleGroup[];
  isBodyWeight!: boolean;
}
