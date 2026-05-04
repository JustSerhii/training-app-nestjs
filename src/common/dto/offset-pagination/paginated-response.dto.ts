import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page' })
  currentPage: number;

  @ApiProperty({ description: 'Limit for a page' })
  limit: number;

  @ApiProperty({ description: 'Total records' })
  totalRecords: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;

  @ApiProperty({ description: 'Next page if exists', required: false })
  nextPage?: number;

  @ApiProperty({ description: 'Previous page if exists', required: false })
  previousPage?: number;

  constructor(totalRecords: number, page: number, limit: number) {
    this.currentPage = page;
    this.limit = limit;
    this.totalRecords = totalRecords;
    this.totalPages = limit > 0 ? Math.ceil(totalRecords / limit) : 0;
    this.nextPage = page < this.totalPages ? page + 1 : undefined;
    this.previousPage = page > 1 ? page - 1 : undefined;
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ type: [Object] })
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.pagination = meta;
  }
}
