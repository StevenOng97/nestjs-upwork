import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, IsOptional, IsObject, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { MovieStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FeedbackDto {
  @ApiProperty({ description: 'The content of the feedback', example: 'Great movie!' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'The rating of the movie', example: 4.5, minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}

export class UpdateMovieDto extends PartialType(OmitType(CreateMovieDto, ['poster'] as const)) {
  @ApiProperty({ required: false, type: 'string', format: 'binary', description: 'Movie poster file' })
  @IsOptional()
  poster?: Express.Multer.File;

  @ApiProperty({ required: false, type: FeedbackDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FeedbackDto)
  feedback?: FeedbackDto;
}