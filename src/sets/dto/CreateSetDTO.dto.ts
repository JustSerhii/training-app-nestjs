import { SetType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateSetDTO {
  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsNumber()
  reps!: number;

  @IsOptional()
  @IsEnum(SetType)
  type?: SetType;
}
