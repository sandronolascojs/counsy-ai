#!/bin/bash

# Configure AWS CLI
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localstack:4566

# Create AWS config directory if it doesn't exist
mkdir -p ~/.aws

# Create AWS credentials file
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = test
aws_secret_access_key = test
EOF

# Create AWS config file
cat > ~/.aws/config << EOF
[default]
region = us-east-1
output = json
EOF

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
echo "📧 SNS Topic ARN: $TOPIC_ARN"

# Create SQS queue
echo "Creating SQS queue..."
QUEUE_URL=$(aws sqs create-queue --queue-name email-notifications-queue --endpoint-url http://localstack:4566 --query 'QueueUrl' --output text)
echo "📬 SQS Queue URL: $QUEUE_URL"

# Get queue ARN
echo "Getting queue ARN..."
QUEUE_ARN=$(aws sqs get-queue-attributes --queue-url "$QUEUE_URL" --attribute-names QueueArn --endpoint-url http://localstack:4566 --query 'Attributes.QueueArn' --output text)
echo "Queue ARN: $QUEUE_ARN"

# Create SQS policy to allow SNS to send messages
echo "Setting SQS policy..."
aws sqs set-queue-attributes \
  --queue-url "$QUEUE_URL" \
  --attributes 'Policy={"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"sns.amazonaws.com"},"Action":"sqs:SendMessage","Resource":"'$QUEUE_ARN'","Condition":{"ArnEquals":{"aws:SourceArn":"'$TOPIC_ARN'"}}}]}' \
  --endpoint-url http://localstack:4566

# Subscribe SQS to SNS
echo "Subscribing SQS to SNS..."
SUBSCRIPTION_ARN=$(aws sns subscribe \
  --topic-arn "$TOPIC_ARN" \
  --protocol sqs \
  --notification-endpoint "$QUEUE_ARN" \
  --endpoint-url http://localstack:4566 \
  --query 'SubscriptionArn' \
  --output text)

echo "Subscription ARN: $SUBSCRIPTION_ARN"

echo ""
echo "✅ Setup complete!"
echo "📧 SNS Topic ARN: $TOPIC_ARN"
echo "📬 SQS Queue URL: $QUEUE_URL"
echo "🔗 Subscription ARN: $SUBSCRIPTION_ARN"
echo ""
