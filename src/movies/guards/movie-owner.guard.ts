import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MoviesService } from '../services/movies.service';

@Injectable()
export class MovieOwnerGuard implements CanActivate {
  constructor(private moviesService: MoviesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const movieId = +request.params.id;

    const movie = await this.moviesService.findOne(movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (movie.data.userId !== user.id) {
      throw new ForbiddenException('You are not the owner of this movie');
    }

    return true;
  }
}
