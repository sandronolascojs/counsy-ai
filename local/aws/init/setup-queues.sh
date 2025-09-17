#!/bin/bash

# Configure AWS CLI
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localstack:4566

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
until curl -f http://localstack:4566/_localstack/health >/dev/null 2>&1; do
  echo "Waiting for LocalStack..."
  sleep 2
done

echo "LocalStack is ready!"

# Create SNS topic
echo "Creating SNS topic..."
TOPIC_ARN=$(aws sns create-topic --name notifications-topic --endpoint-url http://localstack:4566 --query 'TopicArn' --output text)
echo "Topic ARN: $TOPIC_ARN"

# Create SQS queue
echo "Creating SQS queue..."
QUEUE_URL=$(aws sqs create-queue --queue-name email-notifications-queue --endpoint-url http://localstack:4566 --query 'QueueUrl' --output text)
echo "Queue URL: $QUEUE_URL"

# Get queue ARN
echo "Getting queue ARN..."
QUEUE_ARN=$(aws sqs get-queue-attributes --queue-url "$QUEUE_URL" --attribute-names QueueArn --endpoint-url http://localstack:4566 --query 'Attributes.QueueArn' --output text)
echo "Queue ARN: $QUEUE_ARN"

# Try to subscribe SQS to SNS
echo "Attempting SNS-SQS subscription..."
if aws sns subscribe --topic-arn "$TOPIC_ARN" --protocol sqs --endpoint "$QUEUE_ARN" --endpoint-url http://localstack:4566 >/dev/null 2>&1; then
  echo "✅ SNS-SQS subscription successful!"
else
  echo "⚠️  SNS-SQS subscription failed, but resources are created"
fi

echo ""
echo "✅ Setup complete!"
echo "📧 SNS Topic ARN: $TOPIC_ARN"
echo "📬 SQS Queue URL: $QUEUE_URL"
echo ""
