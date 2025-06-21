import { Appointment } from '../../../domain/entities/appointment.entity';

export interface IGetAppointmentsByInsuredUseCase {
  execute(insuredId: string): Promise<Appointment[]>;
}

export const GET_APPOINTMENTS_BY_INSURED_USE_CASE_TOKEN =
  'IGetAppointmentsByInsuredUseCase';
