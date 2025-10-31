// src/users/dto/search-users.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SortDto } from '../../common/dto/sort.dto';

export class SearchUsersDto extends PaginationDto implements SortDto {
  @IsOptional()
  @IsString()
  search?: string;

  // 排序字段
  @IsOptional()
  @IsString()
  order: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  role?: string;
}
