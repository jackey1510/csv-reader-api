import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CsvParser, ParsedData } from 'nest-csv-parser';
import {
  Connection,
  FindConditions,
  getMongoRepository,
  MongoRepository,
} from 'typeorm';

import * as fs from 'fs';
import { SalesReport } from './entity/sales.report.entity';

// class SalesReport {
//   user_name: string;

//   age: number;

//   height: number;

//   sale_amount: number;

//   last_purchase_date: Date;

//   created_at: Date;
// }
@Injectable()
export class AppService {
  private readonly salesReportRepository;
  constructor(
    private readonly csvParser: CsvParser, // @Inject('SALES_REPORT_REPOSITORY') // private readonly salesReportRepository: MongoRepository<SalesReport>,
  ) // @Inject('DATABASE_CONNECTION')
  // private readonly db: Connection,
  {
    this.salesReportRepository = db.getRepository(SalesReport);
  }

  async saveRecord(file: Express.Multer.File) {
    const filePath = __dirname + '/../' + file.path;
    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must be csv');
    }
    const stream = fs.createReadStream(filePath);
    const sales: ParsedData<SalesReport> = await this.csvParser.parse(
      stream,
      SalesReport,
      undefined,
      undefined,
      { strict: true, separator: ',' },
    );

    fs.unlinkSync(filePath);

    return await this.salesReportRepository.insertMany(sales.list);
  }

  async getRecord(startDate?: Date, endDate?: Date) {
    return this.salesReportRepository.find();
  }
}
