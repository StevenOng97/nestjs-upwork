import { Movie, MovieStatus, Movie as PrismaMovie } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class MovieEntity implements PrismaMovie {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  poster: string;

  @ApiProperty()
  publishingYear: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  @IsOptional()
  createdAt: Date;

  @ApiProperty()
  @IsOptional()
  updatedAt: Date;

  @ApiProperty()
  status: MovieStatus;

  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial);
  }
}