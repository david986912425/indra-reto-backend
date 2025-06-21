import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { Injectable } from '@nestjs/common';

import { Appointment } from '../../../../domain/entities/appointment.entity';
import { INotificationService } from '../../../../domain/services/notification.service.interface';
import { Env } from '../../../config/env';

@Injectable()
export class SnsNotificationService implements INotificationService {
  private readonly sns = new SNSClient({ region: process.env.REGION });

  async publishAppointmentCreated(appointment: Appointment): Promise<void> {
    const topic = `arn:aws:sns:${process.env.REGION}:${Env.ACCOUNT_ID}:appointment-processing-topic`;

    await this.sns.send(
      new PublishCommand({
        TopicArn: topic,
        Message: JSON.stringify({
          id: appointment.id,
          insuredId: appointment.insuredId,
          scheduleId: appointment.scheduleId,
          countryISO: appointment.countryISO,
          status: appointment.status,
          createdAt: new Date(appointment.createdAt).toISOString(),
        }),
        MessageAttributes: {
          countryISO: {
            DataType: 'String',
            StringValue: appointment.countryISO,
          },
        },
      }),
    );
  }
}
