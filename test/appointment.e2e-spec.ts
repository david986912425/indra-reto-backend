import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

// Mock AWS SDK
jest.mock('@aws-sdk/client-sns', () => ({
  SNSClient: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PublishCommand: jest.fn(),
}));

describe('Appointment API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/appointment (POST) - should create appointment', () => {
    return request(app.getHttpServer())
      .post('/appointment')
      .send({
        insuredId: '00123',
        scheduleId: 100,
        countryISO: 'PE',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('El agendamiento está en proceso');
        expect(res.body.appointmentId).toBeDefined();
        expect(res.body.status).toBe('pending');
      });
  });

  it('/appointment (POST) - should validate insuredId length', () => {
    return request(app.getHttpServer())
      .post('/appointment')
      .send({
        insuredId: '123', // Invalid length
        scheduleId: 100,
        countryISO: 'PE',
      })
      .expect(400);
  });

  it('/appointment (POST) - should validate countryISO enum', () => {
    return request(app.getHttpServer())
      .post('/appointment')
      .send({
        insuredId: '00123',
        scheduleId: 100,
        countryISO: 'US', // Invalid country
      })
      .expect(400);
  });

  it('/appointment/insured/:insuredId (GET) - should get appointments by insured ID', () => {
    return request(app.getHttpServer())
      .get('/appointment/insured/00123')
      .expect(200)
      .expect((res) => {
        expect(res.body.insuredId).toBe('00123');
        expect(res.body.appointments).toBeDefined();
        expect(res.body.total).toBeDefined();
      });
  });

  it('/appointment (GET) - should return health check', () => {
    return request(app.getHttpServer())
      .get('/appointment')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Medical Appointment Service is running');
        expect(res.body.timestamp).toBeDefined();
      });
  });
});