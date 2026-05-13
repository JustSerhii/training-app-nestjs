import { SetType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateSetDTO {
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @IsNumber()
  @IsOptional()
  reps?: number;

  @IsOptional()
  @IsEnum(SetType)
  type?: SetType;
}
