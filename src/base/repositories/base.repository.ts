import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PaginatedFilterDto } from 'src/base/dto/pagination-filter.dto';
import { IBaseRepository } from './base.repository.interface';
import { ApiResponse } from 'src/interfaces/api-response.interface';
import { MetaData } from '../metadata.interface';
import { CustomException } from '../exceptions/custom-exceptions';
import { ErrorCode } from '../enums/error-codes.enum';

@Injectable()
export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(
    protected readonly prisma: DatabaseService,
    private readonly modelName: string,
  ) {}

  async create(createDto: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const result = await this.prisma[this.modelName].create({ data: createDto });
      return {
        success: true,
        message: `${this.modelName} created successfully`,
        data: result,
      };
    } catch (error) {
      throw new CustomException(
        ErrorCode.DATABASE_ERROR,
        500,
        `Error creating ${this.modelName}: ${error.message}`,
      );
    }
  }

  async findAll(filterDto: PaginatedFilterDto<T>): Promise<ApiResponse<{ data: T[]; meta: MetaData }>> {
    try {
      const { page = 1, limit = 10, select, where, orderBy } = filterDto;
      const skip = (page - 1) * limit;
    
      const [data, total] = await this.prisma.$transaction([
        this.prisma[this.modelName].findMany({
          skip,
          take: limit,
          select,
          where,
          orderBy,
        }),
        this.prisma[this.modelName].count({ where }),
      ]);
    
      return {
        success: true,
        message: `${this.modelName} list retrieved successfully`,
        data: {
          data,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      throw new CustomException(
        ErrorCode.DATABASE_ERROR,
        500,
        `Error retrieving ${this.modelName} list: ${error.message}`,
      );
    }
  }

  async findOne(id: number): Promise<ApiResponse<T>> {
    try {
      const result = await this.prisma[this.modelName].findUnique({ where: { id } });
      if (!result) {
        throw new CustomException(
          ErrorCode.NOT_FOUND,
          404,
          `${this.modelName} not found`,
        );
      }
      return {
        success: true,
        message: `${this.modelName} found`,
        data: result,
      };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException(
        ErrorCode.DATABASE_ERROR,
        500,
        `Error finding ${this.modelName}: ${error.message}`,
      );
    }
  }

  async update(id: number, updateDto: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const result = await this.prisma[this.modelName].update({
        where: { id },
        data: updateDto,
      });
      return {
        success: true,
        message: `${this.modelName} updated successfully`,
        data: result,
      };
    } catch (error) {
      throw new CustomException(
        ErrorCode.DATABASE_ERROR,
        500,
        `Error updating ${this.modelName}: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<ApiResponse<T>> {
    try {
      const result = await this.prisma[this.modelName].delete({ where: { id } });
      return {
        success: true,
        message: `${this.modelName} deleted successfully`,
        data: result,
      };
    } catch (error) {
      throw new CustomException(
        ErrorCode.DATABASE_ERROR,
        500,
        `Error deleting ${this.modelName}: ${error.message}`,
      );
    }
  }
}