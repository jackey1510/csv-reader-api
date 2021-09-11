import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('sales/record')
  @UseInterceptors(FileInterceptor('file'))
  async saveRecord(@UploadedFile() file: Express.Multer.File) {
    return this.appService.saveRecord(file);
  }

  @Get('sales/report')
  async getReport(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.appService.getRecord(startDate, endDate);
  }
}
