import { IsOptional, IsInt, Min, Max, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedFilterDto<T> {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsObject()
  select?: any; // This allows for nested select objects

  @IsOptional()
  where?: any;

  @IsOptional()
  orderBy?: Partial<
    Record<
      keyof T,
      'asc' | 'desc' | { sort: 'asc' | 'desc'; nulls?: 'first' | 'last' }
    >
  >;
}
