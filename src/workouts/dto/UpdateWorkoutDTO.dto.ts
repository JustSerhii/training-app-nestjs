import { IsOptional, IsString } from 'class-validator';

export class UpdateWorkoutDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
