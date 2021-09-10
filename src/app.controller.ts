import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Express } from 'express';

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
    @Param('startDate') startDate?: Date,
    @Param('endDate') endDate?: Date,
  ) {
    return this.appService.getRecord(startDate, endDate);
  }
}
