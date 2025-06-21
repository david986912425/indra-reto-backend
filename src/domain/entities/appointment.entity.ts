import { AppointmentStatus } from '../enums/appointment-status.enum';

export class Appointment {
  public readonly id: string;
  public readonly insuredId: string;
  public readonly scheduleId: number;
  public readonly countryISO: 'PE' | 'CL';
  public readonly status: AppointmentStatus;
  public readonly createdAt: Date;
  public readonly updatedAt?: Date;

  constructor(
    id: string,
    insuredId: string,
    scheduleId: number,
    countryISO: 'PE' | 'CL',
    status: AppointmentStatus,
    createdAt: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.insuredId = insuredId;
    this.scheduleId = scheduleId;
    this.countryISO = countryISO;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export type AppointmentKey = {
  id: string;
};
