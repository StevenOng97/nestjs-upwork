import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from '@prisma/client';
import { PaginatedFilterDto } from 'src/base/dto/pagination-filter.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { MovieEntity } from './entities/movies.entities';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MovieOwnerGuard } from './guards/movie-owner.guard';
import { User } from 'src/interfaces/user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('movies')
@Controller('movies')
@ApiBearerAuth()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('poster'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
    type: MovieEntity,
  })
  @ApiBearerAuth()
  create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() poster: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return this.moviesService.create({ ...createMovieDto, poster }, user.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({
    status: 200,
    description: 'Return all movies.',
    type: [MovieEntity],
  })
  findAll(@Query() filterDto: PaginatedFilterDto<Movie>) {
    return this.moviesService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a movie by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the movie.',
    type: MovieEntity,
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('poster'))
  @UseGuards(MovieOwnerGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
    type: MovieEntity,
  })
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile() poster: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return 'update';
    // return this.moviesService.update(+id, updateMovieDto, user.id);
  }

  @Delete(':id')
  @UseGuards(MovieOwnerGuard)
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully deleted.',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
