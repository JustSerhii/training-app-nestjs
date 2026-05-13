import { IsOptional, IsString } from 'class-validator';

export class UpdateWorkoutExerciseDTO {
  @IsOptional()
  @IsString()
  description?: string;
}
