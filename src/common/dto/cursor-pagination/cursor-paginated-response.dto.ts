import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CursorPaginationMetaDto } from './cursor-pagination-meta.dto';

export class CursorPaginatedResponseDto<T> {
  @ApiProperty({ type: [Object] })
  @Expose()
  data: T[];

  @ApiProperty({ type: CursorPaginationMetaDto })
  @Expose()
  pagination: CursorPaginationMetaDto;

  constructor(data: T[], meta: CursorPaginationMetaDto) {
    this.data = data;
    this.pagination = meta;
  }
}
