import { Appointment } from '../entities/appointment.entity';

export interface INotificationService {
  publishAppointmentCreated(appointment: Appointment): Promise<void>;
}

export const NOTIFICATION_SERVICE_TOKEN = 'INotificationService';
