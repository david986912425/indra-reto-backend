import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateAppointmentDto } from '../../../../application/dto/create-appointment.dto';
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Appointment created successfully and is being processed',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of appointments for the insured',
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

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service is running',
  })
  findAll() {
    return {
      message: 'Medical Appointment Service is running',
      timestamp: new Date().toISOString(),
    };
  }
}
