import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';

import { AppointmentStatus } from '../../../../domain/enums/appointment-status.enum';

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface AppointmentProcessedDetail {
  appointmentId: string;
  countryISO: string;
  status: string;
  processedAt: string;
}

export const handler: EventBridgeHandler<
  'Appointment Processed',
  AppointmentProcessedDetail,
  void
> = async (
  event: EventBridgeEvent<'Appointment Processed', AppointmentProcessedDetail>,
) => {
  console.log(
    'Processing appointment completion:',
    JSON.stringify(event, null, 2),
  );

  try {
    const { appointmentId, status } = event.detail;

    await docClient.send(
      new UpdateCommand({
        TableName: `${process.env.SERVICE}-${process.env.STAGE}-Appointment-table`,
        Key: { id: appointmentId },
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': AppointmentStatus.Completed,
        },
      }),
    );

    console.log(`Appointment ${appointmentId} status updated to ${status}`);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};
