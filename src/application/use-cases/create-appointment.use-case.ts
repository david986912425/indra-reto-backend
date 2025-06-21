import { v4 as uuidv4 } from 'uuid';

import { Inject, Injectable } from '@nestjs/common';

import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { ICreateAppointmentUseCase } from '../ports/input/create-appointment.use-case';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  IAppointmentRepository,
} from '../ports/output/appointment-repository.port';
import {
  INotificationService,
  NOTIFICATION_SERVICE_TOKEN,
} from '../ports/output/notification-service.port';

@Injectable()
export class CreateAppointmentUseCase implements ICreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(NOTIFICATION_SERVICE_TOKEN)
    private readonly notificationService: INotificationService,
  ) {}

  async execute(dto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = new Appointment(
      uuidv4(),
      dto.insuredId,
      dto.scheduleId,
      dto.countryISO,
      AppointmentStatus.Pending,
      new Date(),
    );

    const savedAppointment = await this.appointmentRepository.save(appointment);
    await this.notificationService.publishAppointmentCreated(savedAppointment);

    return savedAppointment;
  }
}
