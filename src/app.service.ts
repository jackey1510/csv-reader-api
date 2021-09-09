import { Injectable } from '@nestjs/common';
import { getMongoManager } from 'typeorm';

@Injectable()
export class AppService {
  private readonly manager = getMongoManager();
  // constructor(private readonly csvParser: CsvParser) {}
  async saveRecord(file: Express.Multer.File) {
    console.log(file);
    //   const csv = file.stream.pipe().on('data', () => {
    //  })
    // await this.manager.insertMany(SalesReport, csv);
  }

  async getRecord() {}
}
