import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
  imports: [ConfigModule],
})
export class DatabaseModule {}
