import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWorkoutExerciseDTO {
  @IsUUID()
  exerciseId!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
