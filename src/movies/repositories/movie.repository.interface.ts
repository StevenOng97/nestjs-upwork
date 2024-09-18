import { IBaseRepository } from 'src/base/repositories/base.repository.interface';
import { Movie } from '@prisma/client';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { FeedbackDto, UpdateMovieDto } from '../dto/update-movie.dto';
import { ApiResponse } from 'src/interfaces/api-response.interface';

export interface IMovieRepository extends IBaseRepository<Movie> {
  createWithFile(data: CreateMovieDto, userId: string): Promise<ApiResponse<Movie>>;
  // update(
  //   id: number,
  //   data: UpdateMovieDto,
  //   feedback?: FeedbackDto,
  //   userId?: string,
  // ): Promise<Movie>;
}