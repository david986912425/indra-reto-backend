import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { SQSEvent, SQSHandler } from 'aws-lambda';

import { Appointment } from '../../../../domain/entities/appointment.entity';

const eventBridge = new EventBridgeClient({ region: process.env.REGION });

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      const snsMessage = JSON.parse(record.body);

      const appointment: Appointment = JSON.parse(snsMessage.Message);

      console.log('Parsed appointment:', appointment);

      await saveToRDSCL();

      await eventBridge.send(
        new PutEventsCommand({
          Entries: [
            {
              Source: 'appointment.cl',
              DetailType: 'Appointment Processed',
              Detail: JSON.stringify({
                appointmentId: appointment.id,
                countryISO: appointment.countryISO,
                status: 'completed',
                processedAt: new Date(),
              }),
              EventBusName: 'default',
            },
          ],
        }),
      );

      console.log(`CL appointment ${appointment.id} processed successfully`);
    } catch (error) {
      console.error('Error processing CL appointment:', error);
      throw error;
    }
  }
};

async function saveToRDSCL(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
}
