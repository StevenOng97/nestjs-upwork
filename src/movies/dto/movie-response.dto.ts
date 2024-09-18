import { ApiProperty } from '@nestjs/swagger';
import { MovieStatus } from '@prisma/client';

export class MovieResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  poster: string;

  @ApiProperty()
  publishingYear: number;

  @ApiProperty()
  status: MovieStatus;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}