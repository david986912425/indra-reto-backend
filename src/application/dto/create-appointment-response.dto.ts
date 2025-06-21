import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentResponseDto {
  @ApiProperty({ example: 'El agendamiento está en proceso' })
  message: string;

  @ApiProperty({ example: 'da9301cd-2475-41c6-8287-13eee34a4aac' })
  appointmentId: string;

  @ApiProperty({ example: 'pending' })
  status: string;
}
