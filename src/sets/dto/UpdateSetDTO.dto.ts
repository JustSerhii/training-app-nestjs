import { SetType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateSetDTO {
  @IsNumber()
  @IsOptional()
  weight?: number | null;

  @IsNumber()
  @IsOptional()
  reps?: number;

  @IsOptional()
  @IsEnum(SetType)
  type?: SetType;
}
