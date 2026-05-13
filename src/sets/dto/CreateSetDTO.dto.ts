import { SetType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateSetDTO {
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsNumber()
  reps!: number;

  @IsOptional()
  @IsEnum(SetType)
  type?: SetType;
}
