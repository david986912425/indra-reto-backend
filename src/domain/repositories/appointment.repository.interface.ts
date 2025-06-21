import { Appointment } from '../entities/appointment.entity';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<Appointment>;
  findByInsuredId(insuredId: string): Promise<Appointment[]>;
  findById(id: string): Promise<Appointment | null>;
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>;
}

export const APPOINTMENT_REPOSITORY_TOKEN = 'IAppointmentRepository';