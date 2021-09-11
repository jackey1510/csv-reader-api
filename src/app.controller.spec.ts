import { CsvModule } from 'nest-csv-parser';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesReport } from './entity/sales.report.entity';

describe('AppController', () => {
  let appController: AppController;
  let mockSalesReportModel = {
    insertMany: jest.fn(),
    find: jest.fn(),
  };
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getModelToken(SalesReport.name),
          useValue: mockSalesReportModel,
        },
      ],
      imports: [ConfigModule.forRoot(), CsvModule],
    }).compile();

    appController = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('save records', () => {
    it('should call saveRecord ', async () => {
      const mockFile: Express.Multer.File = {
        buffer: null,
        destination: null,
        fieldname: 'field',
        filename: 'file.csv',
        path: './',
        size: 100,
        originalname: 'file.csv',
        encoding: 'utf-8',
        mimetype: '',
        stream: undefined,
      };
      jest.spyOn(service, 'saveRecord').mockImplementation();
      await appController.saveRecord(mockFile);
      expect(service.saveRecord).toBeCalled();
    });
  });

  describe('get report', () => {
    it('should call getRecord', async () => {
      jest.spyOn(service, 'getRecord').mockImplementation();
      await appController.getReport();
      expect(service.getRecord).toBeCalled();
    });
  });
});
