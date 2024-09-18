import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { DatabaseModule } from './database/database.module';
import { CustomLogger } from './logger/custom-logger';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    UsersModule,
    MoviesModule,
    AuthModule,
    StorageModule,
    StorageModule,
    DatabaseModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
