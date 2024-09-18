import { Inject, Injectable } from '@nestjs/common';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { PaginatedFilterDto } from 'src/base/dto/pagination-filter.dto';
import { Movie } from '@prisma/client';
import { IMovieRepository } from '../repositories/movie.repository.interface';
import { ApiResponse } from 'src/interfaces/api-response.interface';
import { MetaData } from 'src/base/metadata.interface';

@Injectable()
export class MoviesService {
  constructor(
    @Inject('IMovieRepository')
    private movieRepository: IMovieRepository,
  ) {}

  async create(
    createMovieDto: CreateMovieDto,
    userId: string,
  ): Promise<ApiResponse<Movie>> {
    return this.movieRepository.createWithFile(createMovieDto, userId);
  }

  async findAll(
    filterDto: PaginatedFilterDto<Movie>,
  ): Promise<ApiResponse<{ data: Movie[]; meta: MetaData }>> {
    return this.movieRepository.findAll({
      ...filterDto,
      select: {
        id: true,
        title: true,
        poster: true,
        publishingYear: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        feedbacks: {
          select: {
            rating: true,
            content: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<ApiResponse<Movie>> {
    return this.movieRepository.findOne(id);
  }

  async remove(id: number): Promise<ApiResponse<Movie>> {
    return this.movieRepository.remove(id);
  }
}
