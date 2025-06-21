import { Schema } from 'dynamoose';

export const AppointmentSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  insuredId: {
    type: String,
    index: {
      name: 'insuredIdIndex',
      type: 'global',
    },
  },
  scheduleId: Number,
  countryISO: {
    type: String,
    enum: ['PE', 'CL'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});