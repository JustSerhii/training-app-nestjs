import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CursorPageOptionsDto {
  @ApiPropertyOptional({
    description: 'Cursor for next page',
    example: 'eyJpZCI6IjE2In0=',
  })
  @IsOptional()
  @IsString()
  afterCursor?: string;

  // @ApiPropertyOptional({
  //   description: 'Cursor for previous page',
  //   example: 'eyJpZCI6IjIwIn0=',
  // })
  // @IsOptional()
  // @IsString()
  // beforeCursor?: string;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
