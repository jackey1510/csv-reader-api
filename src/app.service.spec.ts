import { BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { TestingModule, Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SalesReport } from './entity/sales.report.entity';
import { PassThrough } from 'stream';

import * as fs from 'fs';

describe('AppService', () => {
  let service: AppService;
  let mockRecords: SalesReport[] = [
    {
      AGE: 20,
      HEIGHT: 166,
      LAST_PURCHASE_DATE: new Date(),
      SALE_AMOUNT: 1000,
      USER_NAME: 'David',
    },
    {
      AGE: 22,
      HEIGHT: 177,
      LAST_PURCHASE_DATE: new Date(),
      SALE_AMOUNT: 10000,
      USER_NAME: 'Davidson',
    },
  ];

  let mockSalesReportModel = {
    insertMany: jest.fn().mockReturnValue(mockRecords),
    find: jest.fn().mockReturnValue(mockRecords),
  };

  let mockFile: Express.Multer.File;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken(SalesReport.name),
          useValue: mockSalesReportModel,
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<AppService>(AppService);
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
        filename: 'MOCK_DATA.csv',
        path: __dirname + '/../test/file/',
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

    it('should return 2', async () => {
      jest
        .spyOn(service, 'createReadStreamAndUploadToDb')
        .mockImplementation(async () => {
          return 2;
        });
      jest.spyOn(fs, 'unlink').mockImplementation();
      const res = await service.saveRecord(mockFile);
      expect(res).toEqual('uploaded 2 records');
    });
  });

  describe('get records', () => {
    it('should return records', async () => {
      const res = await service.getRecord();
      expect(res).toEqual(mockRecords);
    });
  });
});
