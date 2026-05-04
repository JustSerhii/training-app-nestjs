import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class ReorderWorkoutExercisesDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  workoutExercisesIds!: string[];
}
