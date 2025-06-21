import { Test, TestingModule } from '@nestjs/testing';

import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import {
  CountryISO,
  CreateAppointmentDto,
} from '../dto/create-appointment.dto';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../ports/output/appointment-repository.port';
import { NOTIFICATION_SERVICE_TOKEN } from '../ports/output/notification-service.port';
import { CreateAppointmentUseCase } from '../use-cases/create-appointment.use-case';

describe('CreateAppointmentUseCase', () => {
  let useCase: CreateAppointmentUseCase;

  const mockRepository = {
    save: jest.fn(),
    findByInsuredId: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockNotificationService = {
    publishAppointmentCreated: jest.fn(),
  };

  beforeEach(async () => {
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

    useCase = module.get(CreateAppointmentUseCase);
    jest.clearAllMocks();
  });

  const dto: CreateAppointmentDto = {
    insuredId: '00123',
    scheduleId: 100,
    countryISO: CountryISO.PE,
  };

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create and return an appointment', async () => {
    const mockSavedAppointment = {
      id: 'test-id',
      ...dto,
      status: AppointmentStatus.Pending,
      createdAt: new Date(),
    };

    mockRepository.save.mockResolvedValue(mockSavedAppointment);
    mockNotificationService.publishAppointmentCreated.mockResolvedValue(
      undefined,
    );

    const result = await useCase.execute(dto);

    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        insuredId: dto.insuredId,
        scheduleId: dto.scheduleId,
        countryISO: dto.countryISO,
        status: AppointmentStatus.Pending,
      }),
    );

    expect(
      mockNotificationService.publishAppointmentCreated,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        insuredId: dto.insuredId,
        scheduleId: dto.scheduleId,
        countryISO: dto.countryISO,
        status: AppointmentStatus.Pending,
      }),
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: AppointmentStatus.Pending,
      }),
    );
  });

  it('should generate unique IDs for multiple appointments', async () => {
    mockRepository.save.mockImplementation((appointment) =>
      Promise.resolve({ ...appointment, id: crypto.randomUUID() }),
    );
    mockNotificationService.publishAppointmentCreated.mockResolvedValue(
      undefined,
    );

    const result1 = await useCase.execute(dto);
    const result2 = await useCase.execute(dto);

    expect(result1.id).not.toBe(result2.id);
  });

  it('should throw if repository.save fails', async () => {
    mockRepository.save.mockRejectedValue(new Error('DB error'));
    await expect(useCase.execute(dto)).rejects.toThrow('DB error');
  });

  it('should throw if publishAppointmentCreated fails', async () => {
    mockRepository.save.mockImplementation((appointment) =>
      Promise.resolve({ ...appointment, id: 'test-id', createdAt: new Date() }),
    );
    mockNotificationService.publishAppointmentCreated.mockRejectedValue(
      new Error('SNS error'),
    );

    await expect(useCase.execute(dto)).rejects.toThrow('SNS error');
  });
});
