import { Appointment } from '../../../domain/entities/appointment.entity';
import { CreateAppointmentDto } from '../../dto/create-appointment.dto';

export interface ICreateAppointmentUseCase {
  execute(dto: CreateAppointmentDto): Promise<Appointment>;
}

export const CREATE_APPOINTMENT_USE_CASE_TOKEN = 'ICreateAppointmentUseCase';
