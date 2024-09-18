import { Module } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MoviesController } from './movies.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MovieRepository } from './repositories/movie.repository';
import { MovieOwnerGuard } from './guards/movie-owner.guard';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [MoviesController],
  providers: [
    MoviesService,
    {
      provide: 'IMovieRepository',
      useClass: MovieRepository,
    },
    MovieOwnerGuard,
  ],
  imports: [DatabaseModule, StorageModule],
})
export class MoviesModule {}