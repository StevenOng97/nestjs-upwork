import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class StorageModule {}