import { ViewExerciseDTO } from 'src/exercises/dto';
import { ViewSetDTO } from 'src/sets/dto';

export class ViewWorkoutExerciseDTO {
  id!: string;
  description?: string | null;
  workoutId!: string;
  order!: number;
  exercise!: ViewExerciseDTO;
  sets!: ViewSetDTO[];
}
