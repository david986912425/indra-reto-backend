import { DynamooseModule } from 'nestjs-dynamoose';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppointmentModule } from './appointment.module';

const dynamo = {
  local: process.env.IS_DDB_LOCAL === 'true',
  aws: {
    region: process.env.REGION,
  },
  table: {
    create: true,
    prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
    suffix: '-table',
  },
};

console.log(dynamo);

@Module({
  imports: [
    ConfigModule.forRoot(),
    DynamooseModule.forRoot(dynamo),
    AppointmentModule,
  ],
})
export class AppModule {}
