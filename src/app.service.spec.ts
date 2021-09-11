import { BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { TestingModule, Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SalesReport } from './entity/sales.report.entity';
import { CsvModule, CsvParser } from 'nest-csv-parser';
import * as fs from 'fs';

describe('AppService', () => {
  let service: AppService;
  let mockRecords: SalesReport[] = [];

  let mockSalesReportModel = {
    insertMany: jest.fn().mockReturnValue('test value'),
    find: jest.fn().mockReturnValue(mockRecords),
  };

  let mockFile: Express.Multer.File;
  let csvParser: CsvParser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken(SalesReport.name),
          useValue: mockSalesReportModel,
        },
      ],
      imports: [ConfigModule.forRoot(), CsvModule],
    }).compile();

    service = module.get<AppService>(AppService);
    csvParser = module.get<CsvParser>(CsvParser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save record', () => {
    beforeEach(() => {
      mockFile = {
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
    });

    it('should reject non-csv file', async () => {
      mockFile.originalname = 'file.json';
      try {
        const res = await service.saveRecord(mockFile);
        expect(res).toBeFalsy();
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return test value', async () => {
      jest.spyOn(csvParser, 'parse').mockImplementation(async () => {
        return {
          list: [],
          count: 1,
          offset: 0,
          total: 1,
          then: new Promise(jest.fn()),
        };
      });
      jest.spyOn(fs, 'unlink').mockImplementation();
      jest.spyOn(fs, 'createReadStream').mockImplementation();
      const res = await service.saveRecord(mockFile);
      expect(res).toEqual('test value');
    });
  });

  describe('get records', () => {
    it('should return records', async () => {
      const res = await service.getRecord();
      expect(res).toEqual(mockRecords);
    });
  });
});
