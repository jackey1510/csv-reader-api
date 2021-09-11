import { SalesReport } from './entity/sales.report.entity';
import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Optional,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import {
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('sales/record')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'file.csv',
        },
      },
    },
    description: 'CSV file',
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  async saveRecord(@UploadedFile() file: Express.Multer.File) {
    return this.appService.saveRecord(file);
  }

  @Get('sales/report')
  async getReport(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<SalesReport[]> {
    return this.appService.getRecord(startDate, endDate);
  }
}
