import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appProviders } from './app.provider';
import { MulterModule } from '@nestjs/platform-express';
import { CsvModule } from 'nest-csv-parser';
import {
  MongooseModule,
  MongooseModuleOptions,
  AsyncModelFactory,
} from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { SalesReport, SalesReportSchema } from './entity/sales.report.entity';

@Module({
  imports: [
    // DatabaseModule,
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './files',
      preservePath: true,
    }),
    CsvModule,
    MongooseModule.forRoot(process.env.DATABASE_URL),
    // MongooseModule.forRoot({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (
    //     configService: ConfigService,
    //   ): Promise<MongooseModuleOptions> => {
    //     return { uri: configService.get<string>('DATABASE_URL')! };
    // 	},
    //   connectionName:'mongo'
    // }),
    MongooseModule.forFeature([
      { name: SalesReport.name, schema: SalesReportSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
