import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateWorkoutExerciseDTO {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  exerciseId?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
