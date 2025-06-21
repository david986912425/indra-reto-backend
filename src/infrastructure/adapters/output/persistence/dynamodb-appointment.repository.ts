import { InjectModel, Model } from 'nestjs-dynamoose';

import { Injectable } from '@nestjs/common';

import {
  Appointment,
  AppointmentKey,
} from '../../../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../../domain/enums/appointment-status.enum';
import { IAppointmentRepository } from '../../../../domain/repositories/appointment.repository.interface';

@Injectable()
export class DynamoDbAppointmentRepository implements IAppointmentRepository {
  constructor(
    @InjectModel('Appointment')
    private readonly model: Model<Appointment, AppointmentKey>,
  ) {}

  async save(appointment: Appointment): Promise<Appointment> {
    const saved = await this.model.create({
      id: appointment.id,
      insuredId: appointment.insuredId,
      scheduleId: appointment.scheduleId,
      countryISO: appointment.countryISO,
      status: appointment.status,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    });

    return new Appointment(
      saved.id,
      saved.insuredId,
      saved.scheduleId,
      saved.countryISO,
      saved.status,
      saved.createdAt,
      saved.updatedAt,
    );
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const results = await this.model.query('insuredId').eq(insuredId).exec();

    return results.map(
      (item) =>
        new Appointment(
          item.id,
          item.insuredId,
          item.scheduleId,
          item.countryISO,
          item.status,
          item.createdAt,
          item.updatedAt,
        ),
    );
  }

  async findById(id: string): Promise<Appointment | null> {
    try {
      const result = await this.model.get({ id });
      if (!result) return null;

      return new Appointment(
        result.id,
        result.insuredId,
        result.scheduleId,
        result.countryISO,
        result.status,
        result.createdAt,
        result.updatedAt,
      );
    } catch (error) {
      console.log('Error finding appointment by ID:', error);
      return null;
    }
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    const updated = await this.model.update(
      { id },
      {
        status,
        updatedAt: new Date(),
      },
      {
        return: 'item',
      },
    );

    return new Appointment(
      updated.id,
      updated.insuredId,
      updated.scheduleId,
      updated.countryISO,
      updated.status,
      updated.createdAt,
      updated.updatedAt,
    );
  }
}
