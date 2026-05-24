import { ViewWorkoutExerciseDTO } from 'src/workout-exercises/dto';
import { ViewWorkoutDTO } from './ViewWorkoutDTO.dto';

export class ViewFullWorkoutDTO extends ViewWorkoutDTO {
  workoutExercises!: ViewWorkoutExerciseDTO[];
  totalVolume!: number;
}
