export interface CursorPaginationResult<T> {
  data: T[];
  lastId: string | null;
  hasNextPage: boolean;
  total: number;
}
