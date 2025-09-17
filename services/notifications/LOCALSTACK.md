# LocalStack Setup for Notifications Service

## Prerequisites

1. Docker and Docker Compose installed
2. AWS CLI (optional, for manual testing):

```bash
# macOS
brew install awscli

# Or using pip
pip install awscli
```

## Starting LocalStack with Docker Compose

The project includes a `docker-compose.yml` with LocalStack pre-configured:

```bash
# Start all services (PostgreSQL + LocalStack + AWS initialization)
docker-compose up -d

# Or start only LocalStack
docker-compose up -d localstack aws-init
```

This will:

- Start LocalStack with SNS, SQS, and S3 services
- Automatically create the notifications topic and queue via the init script
- Set up proper networking between services

## Automatic Setup

The `aws-init` service automatically runs `./local/aws/init/setup-queues.sh` which creates:

- SNS Topic: `notifications-topic`
- SQS Queue: `email-notifications-queue`
- SQS Policy to allow SNS to send messages
- SNS → SQS subscription

## Getting Queue URL

After starting with Docker Compose, get the queue URL:

```bash
aws --endpoint-url=http://localhost:4566 sqs get-queue-url --queue-name email-notifications-queue
```

The output will be:

```
{
    "QueueUrl": "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/email-notifications-queue"
}
```

**Note**: For external access from your local machine, use `http://localhost:4566/000000000000/email-notifications-queue` instead.

## Environment Variables

Set these in your `.env.local` file:

```bash
# SQS Queue URL (from Docker Compose setup - use localhost for external access)
SQS_QUEUE_URL=http://localhost:4566/000000000000/email-notifications-queue

# SNS Topic ARN (from Docker Compose setup)
NOTIFICATIONS_TOPIC_ARN=arn:aws:sns:us-east-1:000000000000:notifications-topic

# AWS Configuration (matches docker-compose.yml)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# Database (matches docker-compose.yml)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Email Configuration
FROM_EMAIL=test@example.com
SES_CONFIGURATION_SET=test-config-set
```

## Running the Service

```bash
# Development mode (polls SQS every 10 seconds)
pnpm dev

# Or build and run
pnpm build
pnpm start
```

## Testing

### Test via SNS (Recommended)

This is the same flow as production - API sends to SNS, SNS forwards to SQS:

```bash
aws --endpoint-url=http://localhost:4566 sns publish \
  --topic-arn arn:aws:sns:us-east-1:000000000000:notifications-topic \
  --message '{"template":"RESET_PASSWORD","to":"test@example.com","subject":"Test Reset","props":{"resetPasswordUrl":"https://test.com","firstName":"Test"}}' \
  --message-attributes 'queue={DataType=String,StringValue=MAIL},userId={DataType=String,StringValue=test-user}'
```

### Test via Direct SQS (Alternative)

You can also send directly to SQS for testing:

```bash
aws --endpoint-url=http://localhost:4566 sqs send-message \
  --queue-url http://localhost:4566/000000000000/email-notifications-queue \
  --message-body '{"template":"WELCOME","to":"test@example.com","subject":"Test","props":{"firstName":"Test"}}' \
  --message-attributes 'queue={DataType=String,StringValue=MAIL},userId={DataType=String,StringValue=test-user}'
```

## Troubleshooting

- Check if services are running: `docker-compose ps`
- View LocalStack logs: `docker-compose logs localstack`
- View AWS init logs: `docker-compose logs aws-init`
- Check queue exists: `aws --endpoint-url=http://localhost:4566 sqs list-queues`
- Check topic exists: `aws --endpoint-url=http://localhost:4566 sns list-topics`
- Check SNS subscription: `aws --endpoint-url=http://localhost:4566 sns list-subscriptions-by-topic --topic-arn arn:aws:sns:us-east-1:000000000000:notifications-topic`
- Check queue messages: `aws --endpoint-url=http://localhost:4566 sqs get-queue-attributes --queue-url http://localhost:4566/000000000000/email-notifications-queue --attribute-names ApproximateNumberOfMessages`
- Restart services: `docker-compose restart localstack aws-init`
- Full reset: `docker-compose down -v && docker-compose up -d`

## Architecture

The local development setup mirrors production:

```
API Service → SNS Topic → SQS Queue → Notifications Service
```

1. **API Service** sends messages to SNS using `TypedSnsProducer`
2. **SNS Topic** forwards messages to SQS queue via subscription
3. **SQS Queue** stores messages for processing
4. **Notifications Service** polls SQS every 10 seconds and processes messages
