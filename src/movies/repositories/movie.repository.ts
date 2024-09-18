import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { IMovieRepository } from './movie.repository.interface';
import { AttachmentType, Movie, ResourceType } from '@prisma/client';
import { BaseRepository } from 'src/base/repositories/base.repository';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { FeedbackDto, UpdateMovieDto } from '../dto/update-movie.dto';
import { S3Service } from 'src/storage/services/s3.service';
import { ApiResponse } from 'src/interfaces/api-response.interface';
import { CustomException } from 'src/base/exceptions/custom-exceptions';
import { ErrorCode } from 'src/base/enums/error-codes.enum';

@Injectable()
export class MovieRepository
  extends BaseRepository<Movie>
  implements IMovieRepository
{
  constructor(
    prisma: DatabaseService,
    private s3Service: S3Service,
  ) {
    super(prisma, 'movie');
  }

  async createWithFile(
    data: CreateMovieDto,
    userId: string,
  ): Promise<ApiResponse<Movie>> {
    try {
      const posterUrl = await this.s3Service.uploadFile(
        data.poster,
        `posters/${Date.now()}-${data.poster.originalname}`,
      );

      const movie = await this.prisma.$transaction(async (tx) => {
        const movie = await tx.movie.create({
          data: {
            title: data.title,
            publishingYear: data.publishingYear,
            status: data.status,
            userId: userId,
            poster: posterUrl,
          },
        });

        await tx.attachment.create({
          data: {
            resourceId: movie.id,
            resourceType: 'MOVIE',
            attachmentType: 'IMAGE',
            url: posterUrl,
          },
        });

        return movie;
      });

      return {
        success: true,
        message: 'Movie created successfully',
        data: movie,
      };
    } catch (error) {
      throw new CustomException(
        ErrorCode.DATABASE_ERROR,
        500,
        `Error creating movie: ${error.message}`,
      );
    }
  }

  // async update(
  //   id: number,
  //   data: UpdateMovieDto,
  //   feedback?: FeedbackDto,
  //   userId?: string,
  // ): Promise<Movie> {
  //   return await this.prisma.$transaction(async (tx) => {
  //     const updatedMovie = await tx.movie.update({ where: { id }, data });

  //     if (feedback) {
  //       await tx.movieFeedback.upsert({
  //         where: {
  //           movieId_userId: {
  //             movieId: id,
  //             userId: userId,
  //           },
  //         },
  //         update: feedback,
  //         create: {
  //           ...feedback,
  //           movieId: id,
  //           userId: userId,
  //         },
  //       });
  //     }

  //     return updatedMovie;
  //   });
  // }
}
