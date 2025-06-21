import { Test, TestingModule } from '@nestjs/testing';

import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../ports/output/appointment-repository.port';
import { NOTIFICATION_SERVICE_TOKEN } from '../ports/output/notification-service.port';
import { CreateAppointmentUseCase } from '../use-cases/create-appointment.use-case';
import { CountryISO, CreateAppointmentDto } from '../dto/create-appointment.dto';

describe('CreateAppointmentUseCase', () => {
  let useCase: CreateAppointmentUseCase;
  let mockRepository: any;
  let mockNotificationService: any;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    mockNotificationService = {
      publishAppointmentCreated: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAppointmentUseCase,
        {
          provide: APPOINTMENT_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: NOTIFICATION_SERVICE_TOKEN,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    useCase = module.get<CreateAppointmentUseCase>(CreateAppointmentUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create an appointment successfully', async () => {
    const dto: CreateAppointmentDto = {
      insuredId: '00123',
      scheduleId: 100,
      countryISO: CountryISO.PE,
    };

    const mockSavedAppointment = {
      id: 'test-id',
      insuredId: dto.insuredId,
      scheduleId: dto.scheduleId,
      countryISO: dto.countryISO,
      status: AppointmentStatus.Pending,
      createdAt: new Date(),
    };

    mockRepository.save.mockResolvedValue(mockSavedAppointment);
    mockNotificationService.publishAppointmentCreated.mockResolvedValue(undefined);

    const result = await useCase.execute(dto);

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        insuredId: dto.insuredId,
        scheduleId: dto.scheduleId,
        countryISO: dto.countryISO,
        status: AppointmentStatus.Pending,
      }),
    );
    expect(mockNotificationService.publishAppointmentCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        insuredId: dto.insuredId,
        scheduleId: dto.scheduleId,
        countryISO: dto.countryISO,
        status: AppointmentStatus.Pending,
      }),
    );
    expect(result.id).toBeDefined();
    expect(result.status).toBe(AppointmentStatus.Pending);
  });

  it('should generate a unique ID for each appointment', async () => {
    const dto: CreateAppointmentDto = {
      insuredId: '00123',
      scheduleId: 100,
      countryISO: CountryISO.PE,
    };

    mockRepository.save.mockImplementation((appointment) =>
      Promise.resolve(appointment),
    );
    mockNotificationService.publishAppointmentCreated.mockResolvedValue(undefined);

    const result1 = await useCase.execute(dto);
    const result2 = await useCase.execute(dto);

    expect(result1.id).toBeDefined();
    expect(result2.id).toBeDefined();
    expect(result1.id).not.toBe(result2.id);
  });
});