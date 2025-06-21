import { DynamooseModule } from 'nestjs-dynamoose';

import { Module } from '@nestjs/common';

import { CREATE_APPOINTMENT_USE_CASE_TOKEN } from './application/ports/input/create-appointment.use-case';
import { GET_APPOINTMENTS_BY_INSURED_USE_CASE_TOKEN } from './application/ports/input/get-appointments-by-insured.use-case';
import { APPOINTMENT_REPOSITORY_TOKEN } from './application/ports/output/appointment-repository.port';
import { NOTIFICATION_SERVICE_TOKEN } from './application/ports/output/notification-service.port';
import { CreateAppointmentUseCase } from './application/use-cases/create-appointment.use-case';
import { GetAppointmentsByInsuredUseCase } from './application/use-cases/get-appointments-by-insured.use-case';
import { AppointmentController } from './infrastructure/adapters/input/web/appointment.controller';
import { SnsNotificationService } from './infrastructure/adapters/output/notification/sns-notification.service';
import { DynamoDbAppointmentRepository } from './infrastructure/adapters/output/persistence/dynamodb-appointment.repository';
import { AppointmentSchema } from './infrastructure/adapters/output/persistence/schemas/appointment.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      { name: 'Appointment', schema: AppointmentSchema },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [
    // Use Cases
    {
      provide: CREATE_APPOINTMENT_USE_CASE_TOKEN,
      useClass: CreateAppointmentUseCase,
    },
    {
      provide: GET_APPOINTMENTS_BY_INSURED_USE_CASE_TOKEN,
      useClass: GetAppointmentsByInsuredUseCase,
    },
    // Repositories
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useClass: DynamoDbAppointmentRepository,
    },
    // Services
    {
      provide: NOTIFICATION_SERVICE_TOKEN,
      useClass: SnsNotificationService,
    },
    // Concrete implementations for backward compatibility
    DynamoDbAppointmentRepository,
    SnsNotificationService,
    CreateAppointmentUseCase,
    GetAppointmentsByInsuredUseCase,
  ],
  exports: [
    CREATE_APPOINTMENT_USE_CASE_TOKEN,
    GET_APPOINTMENTS_BY_INSURED_USE_CASE_TOKEN,
    APPOINTMENT_REPOSITORY_TOKEN,
    NOTIFICATION_SERVICE_TOKEN,
  ],
})
export class AppointmentModule {}