import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CursorPaginationMetaDto {
  @ApiProperty()
  @Expose()
  readonly limit: number;

  @ApiProperty({ required: false })
  @Expose()
  readonly afterCursor?: string;

  // @ApiProperty({ required: false })
  // @Expose()
  // readonly beforeCursor?: string;

  @ApiProperty()
  @Expose()
  readonly totalRecords: number;

  constructor(
    limit: number,
    after: string | undefined,
    // before: string | null,
    total: number,
  ) {
    this.limit = limit;
    this.afterCursor = after || undefined;
    // this.beforeCursor = before || undefined;
    this.totalRecords = total;
  }
}
