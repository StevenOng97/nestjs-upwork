import { PaginatedFilterDto } from 'src/base/dto/pagination-filter.dto';
import { MetaData } from '../metadata.interface';
import { ApiResponse } from 'src/interfaces/api-response.interface';

export interface IBaseRepository<T> {
  create(createDto: Partial<T>): Promise<ApiResponse<T>>;
  findAll(filterDto: PaginatedFilterDto<T>): Promise<ApiResponse<{ data: T[]; meta: MetaData }>>;
  findOne(id: number): Promise<ApiResponse<T>>;
  update(id: number, updateDto: Partial<T>): Promise<ApiResponse<T>>;
  remove(id: number): Promise<ApiResponse<T>>;
}