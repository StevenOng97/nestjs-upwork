import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsEnum, Min, Max } from 'class-validator';
import { MovieStatus } from '@prisma/client';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception', description: 'The title of the movie' })
  @IsString()
  title: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Movie poster file' })
  poster: Express.Multer.File;

  @ApiProperty({ example: 2010, description: 'Year the movie was published' })
  @IsInt()
  @Min(1888) // First movie ever made
  @Max(new Date().getFullYear())
  publishingYear: number;

  @ApiProperty({ enum: MovieStatus, example: MovieStatus.PUBLISHED, description: 'Status of the movie' })
  @IsEnum(MovieStatus)
  status: MovieStatus;
}