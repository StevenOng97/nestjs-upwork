import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './base/filters/global-exception.filter';
import { CustomLogger } from './logger/custom-logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Set up Swagger before applying global prefix
  const config = new DocumentBuilder()
    .setTitle('Movies API Title')
    .setDescription('API for managing movies and users')
    .setVersion('1.0')
    .addTag('movies')
    .addBearerAuth({ name: 'auth', type: 'http', scheme: 'bearer' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Apply global prefix after Swagger setup
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(configService.get<number>('PORT') || 8080);
}
bootstrap();
