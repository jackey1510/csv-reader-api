import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesReport, SalesReportSchema } from './entity/sales.report.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './files',
      preservePath: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MongooseModuleOptions> => {
        return { uri: configService.get<string>('DATABASE_URL')! };
      },
    }),
    MongooseModule.forFeature([
      { name: SalesReport.name, schema: SalesReportSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
