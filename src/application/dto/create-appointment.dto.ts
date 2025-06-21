import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export enum CountryISO {
  PE = 'PE',
  CL = 'CL',
}

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 5, { message: 'insuredId must be exactly 5 characters' })
  insuredId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'scheduleId must be a positive number' })
  scheduleId: number;

  @IsNotEmpty()
  @IsEnum(CountryISO, { message: 'countryISO must be either PE or CL' })
  countryISO: CountryISO;
}
