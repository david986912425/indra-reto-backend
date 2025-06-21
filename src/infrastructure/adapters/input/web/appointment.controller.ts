import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreateAppointmentResponseDto } from '../../../../application/dto/create-appointment-response.dto';
import { CreateAppointmentDto } from '../../../../application/dto/create-appointment.dto';
import { GetAppointmentsByInsuredResponseDto } from '../../../../application/dto/get-appointment-response.dto';
import {
  CREATE_APPOINTMENT_USE_CASE_TOKEN,
  ICreateAppointmentUseCase,
} from '../../../../application/ports/input/create-appointment.use-case';
import {
  GET_APPOINTMENTS_BY_INSURED_USE_CASE_TOKEN,
  IGetAppointmentsByInsuredUseCase,
} from '../../../../application/ports/input/get-appointments-by-insured.use-case';

@ApiTags('appointments')
@Controller('appointment')
export class AppointmentController {
  constructor(
    @Inject(CREATE_APPOINTMENT_USE_CASE_TOKEN)
    private readonly createAppointmentUseCase: ICreateAppointmentUseCase,
    @Inject(GET_APPOINTMENTS_BY_INSURED_USE_CASE_TOKEN)
    private readonly getAppointmentsByInsuredUseCase: IGetAppointmentsByInsuredUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new medical appointment' })
  @ApiCreatedResponse({
    description: 'Appointment created successfully and is being processed',
    type: CreateAppointmentResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() body: CreateAppointmentDto) {
    const appointment = await this.createAppointmentUseCase.execute(body);
    return {
      message: 'El agendamiento está en proceso',
      appointmentId: appointment.id,
      status: appointment.status,
    };
  }

  @Get('insured/:insuredId')
  @ApiOperation({ summary: 'Get appointments by insured ID' })
  @ApiParam({
    name: 'insuredId',
    description: 'The 5-digit insured ID',
    example: '00123',
  })
  @ApiOkResponse({
    description: 'List of appointments for the insured',
    type: GetAppointmentsByInsuredResponseDto,
  })
  async findByInsuredId(@Param('insuredId') insuredId: string) {
    const appointments =
      await this.getAppointmentsByInsuredUseCase.execute(insuredId);
    return {
      insuredId,
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        insuredId: appointment.insuredId,
        scheduleId: appointment.scheduleId,
        countryISO: appointment.countryISO,
        status: appointment.status,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })),
      total: appointments.length,
    };
  }
}
