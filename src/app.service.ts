import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { SalesReport, SalesReportDocument } from './entity/sales.report.entity';
import * as csv from 'csv-parser';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  constructor(
    @InjectModel(SalesReport.name)
    private salesReportModel: Model<SalesReportDocument>,
  ) {}

  async saveRecord(file: Express.Multer.File) {
    const filePath = __dirname + '/../' + file.path;
    if (!file.originalname.endsWith('.csv')) {
      this.removeFile(filePath);
      throw new BadRequestException('File must be csv');
    }
    const total = await this.createReadStreamAndUploadToDb(filePath);

    this.removeFile(filePath);

    return `uploaded ${total} records`;
  }

  async createReadStreamAndUploadToDb(filePath: string) {
    const dataList: SalesReport[] = [];
    let total = 0;

    const stream = fs
      .createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row: SalesReport) => {
        if (dataList.length < 1000) {
          dataList.push(row);
        } else {
          stream.pause();
          const result = await this.salesReportModel
            .insertMany(dataList)
            .catch(() => {
              throw new BadRequestException('Invalid CSV');
            });
          total += result.length;
          dataList.length = 0;
          stream.resume();
        }
      });

    const end = new Promise(function (resolve, reject) {
      stream.on('end', async () => {
        resolve(true);
      });
      stream.on('error', reject);
    });

    await end;
    await this.salesReportModel.insertMany(dataList).catch(() => {
      throw new BadRequestException('Invalid CSV');
    });
    total += dataList.length;
    return total;
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
