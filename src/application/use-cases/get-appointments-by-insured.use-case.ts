import { Inject, Injectable } from '@nestjs/common';

import { Appointment } from '../../domain/entities/appointment.entity';
import { IGetAppointmentsByInsuredUseCase } from '../ports/input/get-appointments-by-insured.use-case';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  IAppointmentRepository,
} from '../ports/output/appointment-repository.port';

@Injectable()
export class GetAppointmentsByInsuredUseCase
  implements IGetAppointmentsByInsuredUseCase
{
  constructor(
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(insuredId: string): Promise<Appointment[]> {
    console.log(`Getting appointments for insured: ${insuredId}`);
    return this.appointmentRepository.findByInsuredId(insuredId);
  }
}
