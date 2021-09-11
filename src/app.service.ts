import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { CsvParser, ParsedData } from 'nest-csv-parser';
import { SalesReport, SalesReportDocument } from './entity/sales.report.entity';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  constructor(
    private readonly csvParser: CsvParser,
    @InjectModel(SalesReport.name)
    private salesReportModel: Model<SalesReportDocument>,
  ) {}

  async saveRecord(file: Express.Multer.File) {
    const filePath = __dirname + '/../' + file.path;
    if (!file.originalname.endsWith('.csv')) {
      this.removeFile(filePath);
      throw new BadRequestException('File must be csv');
    }
    const stream = fs.createReadStream(filePath);

    const sales: ParsedData<SalesReport> = await this.csvParser
      .parse(stream, SalesReport, undefined, undefined, {
        strict: true,
        separator: ',',
      })
      .catch(() => {
        this.removeFile(filePath);
        throw new BadRequestException('CSV cannot be parsed');
      });
    this.removeFile(filePath);
    const result = await this.salesReportModel.insertMany(sales.list);
    return `uploaded ${result.length} records`;
  }

  async getRecord(startDate?: Date, endDate?: Date) {
    this.logger.log(`startDate: ${startDate}, endDate: ${endDate}`);
    return this.salesReportModel.find({
      LAST_PURCHASE_DATE: {
        $gte: startDate ? startDate : new Date(0),
        $lte: endDate ? endDate : new Date(),
      },
    });
  }

  private removeFile(path: string) {
    fs.unlink(path, (err) => {
      if (err) {
        this.logger.error(err.message);
      }
    });
  }
}
