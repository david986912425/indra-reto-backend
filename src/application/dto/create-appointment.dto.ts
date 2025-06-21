import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export enum CountryISO {
  PE = 'PE',
  CL = 'CL',
}

export class CreateAppointmentDto {
  @ApiProperty({
    example: '00003',
    description: 'The 5-character insured ID',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 5, { message: 'insuredId must be exactly 5 characters' })
  insuredId: string;

  @ApiProperty({
    example: 123,
    description: 'The schedule identifier (must be a positive number)',
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'scheduleId must be a positive number' })
  scheduleId: number;

  @ApiProperty({
    example: 'PE',
    enum: CountryISO,
    description: 'Country code of the appointment (PE or CL)',
  })
  @IsNotEmpty()
  @IsEnum(CountryISO, { message: 'countryISO must be either PE or CL' })
  countryISO: CountryISO;
}
