import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';

class SetOrderItemDTO {
  @IsUUID()
  id!: string;

  @IsInt()
  @Min(1)
  order!: number;
}

export class ReorderSetsDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetOrderItemDTO)
  sets!: SetOrderItemDTO[];
}
