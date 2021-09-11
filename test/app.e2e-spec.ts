import { filerByStartDateResult } from './results/filterByStartDate';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { mongo } from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongodb: MongoMemoryServer;

  //setup in memory db
  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    if (!uri) throw Error('Uri is empty');
    process.env.DATABASE_URL = uri;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/sales/record (POST)', () => {
    it('success', () => {
      const filePath = __dirname + '/file/MOCK_DATA.csv';
      return request(app.getHttpServer())
        .post('/sales/record')
        .set('Content-Type', 'multipart/form-data')
        .attach('file', filePath, {
          filename: 'MOCK_DATA.csv',
        })
        .expect(201)
        .expect('uploaded 100 records');
    });

    it('fail for json', () => {
      const filePath = __dirname + '/file/MOCK_DATA.json';
      return request(app.getHttpServer())
        .post('/sales/record')
        .set('Content-Type', 'multipart/form-data')
        .attach('file', filePath)
        .expect(400);
    });

    it('fail for invalid csv', () => {
      const filePath = __dirname + '/file/MOCK_DATA.json';
      return request(app.getHttpServer())
        .post('/sales/record')
        .set('Content-Type', 'multipart/form-data')
        .attach('file', filePath, { filename: 'MOCK_DATA.csv' })
        .expect(400);
    });
  });

  describe('/sales/report (GET)', () => {
    it('success', () => {
      return request(app.getHttpServer()).get('/sales/report').expect(200);
    });
    it('filters by start date', () => {
      return request(app.getHttpServer())
        .get('/sales/report')
        .query({
          startDate: '2021-09-01',
        })
        .expect(200)
        .expect((res: Response) => {
          expect(res.body).toHaveLength(2);
        });
    });

    it('filters by end date', () => {
      return request(app.getHttpServer())
        .get('/sales/report')
        .query({
          endDate: '2021-01-01',
        })
        .expect(200)
        .expect((res: Response) => {
          expect(res.body).toHaveLength(24);
        });
    });
  });

  afterAll(async () => {
    await mongodb.stop();
    await app.close();
    return;
  });
});
