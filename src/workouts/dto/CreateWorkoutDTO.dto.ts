import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
