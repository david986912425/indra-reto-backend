import { DynamooseModule } from 'nestjs-dynamoose';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppointmentModule } from './appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DynamooseModule.forRoot({
      local: process.env.IS_DDB_LOCAL === 'true',
      aws: {
        region: process.env.REGION,
      },
      table: {
        create: true,
        prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
        suffix: '-table',
      },
    }),
    AppointmentModule,
  ],
})
export class AppModule {}
