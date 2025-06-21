import { ApiProperty } from '@nestjs/swagger';

class AppointmentResponseDto {
  @ApiProperty({ example: '3aa4054f-f27d-409f-85eb-0478406aba4d' })
  id: string;

  @ApiProperty({ example: '00003' })
  insuredId: string;

  @ApiProperty({ example: 123 })
  scheduleId: number;

  @ApiProperty({ example: 'PE' })
  countryISO: string;

  @ApiProperty({ example: 'completed' })
  status: string;

  @ApiProperty({ example: '2025-06-21T07:41:08.613Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-21T07:41:08.629Z' })
  updatedAt: string;
}

export class GetAppointmentsByInsuredResponseDto {
  @ApiProperty({ example: '00003' })
  insuredId: string;

  @ApiProperty({ type: [AppointmentResponseDto] })
  appointments: AppointmentResponseDto[];

  @ApiProperty({ example: 1 })
  total: number;
}
