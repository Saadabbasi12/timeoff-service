import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TimeOff API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // ✅ TEST 1: HCM Batch Sync
  describe('GET /hcm/batch', () => {
    it('should return list of employee balances', () => {
      return request(app.getHttpServer())
        .get('/hcm/batch')
        .expect(200);
    });
  });

  // ✅ TEST 2: HCM Get Balance
  describe('GET /hcm/balance', () => {
    it('should return balance for employee', () => {
      return request(app.getHttpServer())
        .get('/hcm/balance?employeeId=1&locationId=A')
        .expect(200);
    });
  });

  // ✅ TEST 3: Sync Balances
  describe('POST /timeoff/sync', () => {
    it('should sync balances from HCM', () => {
      return request(app.getHttpServer())
        .post('/timeoff/sync')
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('Sync completed successfully');
        });
    });
  });

  // ✅ TEST 4: Request Time Off - Success
  describe('POST /timeoff/request', () => {
    it('should approve time off request with valid data', async () => {
      // sync first so balance exists
      await request(app.getHttpServer())
        .post('/timeoff/sync')
        .expect(201);

      return request(app.getHttpServer())
        .post('/timeoff/request')
        .send({
          employeeId: '1',
          locationId: 'A',
          days: 2,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe('APPROVED');
        });
    });

    // ✅ TEST 5: Request Time Off - Validation Error
    it('should reject request with missing fields', () => {
      return request(app.getHttpServer())
        .post('/timeoff/request')
        .send({})
        .expect(400);
    });

    // ✅ TEST 6: Request Time Off - Insufficient Balance
    it('should reject request with too many days', async () => {
      await request(app.getHttpServer())
        .post('/timeoff/sync')
        .expect(201);

      return request(app.getHttpServer())
        .post('/timeoff/request')
        .send({
          employeeId: '1',
          locationId: 'A',
          days: 9999,
        })
        .expect(400);
    });

    // ✅ TEST 7: Request Time Off - Invalid data type
    it('should reject request when days is a string', () => {
      return request(app.getHttpServer())
        .post('/timeoff/request')
        .send({
          employeeId: '1',
          locationId: 'A',
          days: 'two',        // ❌ wrong type
        })
        .expect(400);
    });
  });

  // ✅ TEST 8: HCM Deduct Balance
  describe('POST /hcm/deduct', () => {
    it('should deduct balance successfully', () => {
      return request(app.getHttpServer())
        .post('/hcm/deduct')
        .send({
          employeeId: '1',
          locationId: 'A',
          days: 2,
        })
        .expect(201);
    });
  });
});