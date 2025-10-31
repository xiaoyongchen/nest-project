// src/common/dto/sort.dto.ts
import { IsOptional, IsIn } from 'class-validator';

export class SortDto {
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  sortBy: string = 'createdAt';
}
