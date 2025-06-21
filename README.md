# Medical Appointment Scheduling Backend - Hexagonal Architecture

A serverless backend application for scheduling medical appointments for insured patients in Peru (PE) and Chile (CL), built using **Hexagonal Architecture** principles.

## Architecture Overview

This application implements a complete serverless architecture using AWS services with **Hexagonal Architecture** (Ports and Adapters):

### AWS Services Flow
1. **API Gateway + Lambda**: Receives appointment requests
2. **DynamoDB**: Stores appointment data with status tracking
3. **SNS**: Routes messages by country using message filters
4. **SQS**: Queues for country-specific processing (PE/CL)
5. **EventBridge**: Handles appointment completion events
6. **Lambda Functions**: Process appointments per country and update status

### Hexagonal Architecture Structure

```
src/modules/appointment/
├── domain/                           # Core business logic (inner layer)
│   ├── entities/
│   │   └── appointment.entity.ts     # Domain entities
│   ├── enums/
│   │   └── appointment-status.enum.ts
│   ├── repositories/
│   │   └── appointment.repository.interface.ts  # Repository contracts
│   └── services/
│       └── notification.service.interface.ts    # Service contracts
├── application/                      # Use cases and application logic
│   ├── dto/
│   │   └── create-appointment.dto.ts
│   ├── ports/
│   │   ├── input/                    # Primary ports (driving adapters)
│   │   │   ├── create-appointment.use-case.ts
│   │   │   └── get-appointments-by-insured.use-case.ts
│   │   └── output/                   # Secondary ports (driven adapters)
│   │       ├── appointment-repository.port.ts
│   │       └── notification-service.port.ts
│   └── use-cases/                    # Application services
│       ├── create-appointment.use-case.ts
│       └── get-appointments-by-insured.use-case.ts
├── infrastructure/                   # External adapters (outer layer)
│   └── adapters/
│       ├── input/                    # Primary adapters
│       │   └── web/
│       │       └── appointment.controller.ts    # REST API adapter
│       └── output/                   # Secondary adapters
│           ├── persistence/
│           │   ├── dynamodb-appointment.repository.ts  # DynamoDB adapter
│           │   └── schemas/
│           │       └── appointment.schema.ts
│           └── notification/
│               └── sns-notification.service.ts         # SNS adapter
└── handlers/                         # Lambda handlers
    ├── pe.ts
    ├── cl.ts
    └── completion.ts
```

## Hexagonal Architecture Benefits

1. **Independence**: Business logic is independent of external frameworks
2. **Testability**: Easy to test with mock implementations
3. **Flexibility**: Easy to swap implementations (e.g., DynamoDB → PostgreSQL)
4. **Maintainability**: Clear separation of concerns
5. **SOLID Principles**: Follows dependency inversion and single responsibility

## Technologies

- [AWS Lambda](https://aws.amazon.com/lambda)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb)
- [AWS SNS](https://aws.amazon.com/sns)
- [AWS SQS](https://aws.amazon.com/sqs)
- [AWS EventBridge](https://aws.amazon.com/eventbridge)
- [Serverless Framework](https://serverless.com/framework/docs/providers/aws/)
- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## API Endpoints

### POST /appointment
Creates a new medical appointment request.

**Request Body:**
```json
{
  "insuredId": "00123",
  "scheduleId": 100,
  "countryISO": "PE"
}
```

**Response:**
```json
{
  "message": "El agendamiento está en proceso",
  "appointmentId": "uuid-here",
  "status": "pending"
}
```

### GET /appointment/insured/{insuredId}
Retrieves all appointments for a specific insured patient.

**Response:**
```json
{
  "insuredId": "00123",
  "appointments": [
    {
      "id": "uuid-here",
      "insuredId": "00123",
      "scheduleId": 100,
      "countryISO": "PE",
      "status": "completed",
      "createdAt": "2024-01-01T12:00:00Z",
      "updatedAt": "2024-01-01T12:05:00Z"
    }
  ],
  "total": 1
}
```

## Setup and Installation

### Prerequisites
- Node.js 20.x
- AWS CLI configured
- Serverless Framework

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd medical-appointment-backend

# Install dependencies
npm install

# Install DynamoDB local for development
npm run ddb:install
```

### AWS Credentials Setup

1. [Sign up for an AWS account](https://aws.amazon.com/console/)
2. Create an IAM user with appropriate permissions
3. Configure AWS CLI:

```bash
aws configure
```

## Development

### Local Development

```bash
# Start DynamoDB local
npm run ddb:start

# Start the application locally
npm run start:watch

# Or start with serverless offline
npm run sls:offline
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Deployment

```bash
# Deploy to AWS
npm run deploy

# Deploy to specific stage
npm run deploy -- --stage prod
```

## API Documentation

When running locally, Swagger documentation is available at:
- Local: http://localhost:3000/docs
- Deployed: https://your-api-gateway-url/dev/docs

## Data Flow

1. **Request Reception**: API Gateway receives appointment request
2. **Use Case Execution**: CreateAppointmentUseCase processes the request
3. **Data Storage**: Repository saves appointment to DynamoDB with "pending" status
4. **Message Publishing**: NotificationService publishes message to SNS with country filter
5. **Country Processing**: SQS routes to appropriate country-specific Lambda
6. **RDS Storage**: Country Lambda simulates saving to RDS MySQL
7. **Completion Event**: EventBridge receives completion notification
8. **Status Update**: Completion Lambda updates DynamoDB status to "completed"

## Validation Rules

- `insuredId`: Must be exactly 5 characters (can include leading zeros)
- `scheduleId`: Must be a positive number
- `countryISO`: Must be either "PE" or "CL"

## Architecture Principles

This project follows:
- **Hexagonal Architecture**: Clear separation between business logic and external concerns
- **SOLID Principles**: Single responsibility, dependency injection, etc.
- **Clean Architecture**: Domain, application, and infrastructure layers
- **Repository Pattern**: Abstraction for data access
- **Use Case Pattern**: Application-specific business rules
- **Dependency Inversion**: High-level modules don't depend on low-level modules

## Dependency Injection

The application uses NestJS dependency injection with tokens to ensure proper decoupling:

```typescript
// Tokens for dependency injection
export const APPOINTMENT_REPOSITORY_TOKEN = 'IAppointmentRepository';
export const NOTIFICATION_SERVICE_TOKEN = 'INotificationService';
export const CREATE_APPOINTMENT_USE_CASE_TOKEN = 'ICreateAppointmentUseCase';
```

## Environment Variables

- `SERVICE`: Service name
- `STAGE`: Deployment stage (dev, prod)
- `REGION`: AWS region
- `SNS_TOPIC_ARN`: SNS topic ARN for appointment processing
- `IS_DDB_LOCAL`: Flag for local DynamoDB usage

## Monitoring and Logging

All Lambda functions include comprehensive logging for:
- Request processing
- Error handling
- Performance monitoring
- Business event tracking

## Security Considerations

- IAM roles with least privilege access
- Input validation using class-validator
- CORS enabled for web clients
- Environment-specific configurations

## Testing Strategy

- **Unit Tests**: Test use cases and domain logic in isolation
- **Integration Tests**: Test adapters with real implementations
- **E2E Tests**: Test complete user journeys
- **Mock Implementations**: Easy testing with hexagonal architecture

## Future Enhancements

- RDS MySQL integration for production
- Email notification service
- Appointment conflict detection
- Advanced error handling and retry mechanisms
- Monitoring and alerting setup
- Additional adapters (GraphQL, gRPC, etc.)