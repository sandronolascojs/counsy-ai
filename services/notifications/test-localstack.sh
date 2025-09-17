#!/bin/bash

# Test script for LocalStack setup
echo "🧪 Testing LocalStack setup..."

# Check if LocalStack is running
echo "1. Checking LocalStack health..."
curl -f http://localhost:4566/_localstack/health >/dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ LocalStack is running"
else
  echo "❌ LocalStack is not running. Start with: docker-compose up -d"
  exit 1
fi

# Check SNS topic
echo "2. Checking SNS topic..."
TOPIC_ARN=$(aws --endpoint-url=http://localhost:4566 sns list-topics --query 'Topics[?contains(TopicArn, `notifications-topic`)].TopicArn' --output text)
if [ -n "$TOPIC_ARN" ]; then
  echo "✅ SNS Topic found: $TOPIC_ARN"
else
  echo "❌ SNS Topic not found"
fi

# Check SQS queue
echo "3. Checking SQS queue..."
QUEUE_URL=$(aws --endpoint-url=http://localhost:4566 sqs get-queue-url --queue-name email-notifications-queue --query 'QueueUrl' --output text 2>/dev/null)
if [ -n "$QUEUE_URL" ]; then
  echo "✅ SQS Queue found: $QUEUE_URL"
  # Convert to localhost URL for external access
  LOCALHOST_QUEUE_URL="http://localhost:4566/000000000000/email-notifications-queue"
  echo "📍 Use this URL for external access: $LOCALHOST_QUEUE_URL"
else
  echo "❌ SQS Queue not found"
fi

# Test sending a message
echo "4. Testing message sending..."
if [ -n "$QUEUE_URL" ]; then
  MESSAGE_ID=$(aws --endpoint-url=http://localhost:4566 sqs send-message \
    --queue-url "$QUEUE_URL" \
    --message-body '{"template":"WELCOME","to":"test@example.com","subject":"Test","props":{"firstName":"Test"}}' \
    --message-attributes 'queue={DataType=String,StringValue=MAIL},userId={DataType=String,StringValue=test-user}' \
    --query 'MessageId' --output text 2>/dev/null)
  
  if [ -n "$MESSAGE_ID" ]; then
    echo "✅ Message sent successfully: $MESSAGE_ID"
  else
    echo "❌ Failed to send message"
  fi
fi

# Test receiving messages
echo "5. Testing message receiving..."
if [ -n "$QUEUE_URL" ]; then
  MESSAGES=$(aws --endpoint-url=http://localhost:4566 sqs receive-message \
    --queue-url "$QUEUE_URL" \
    --max-number-of-messages 1 \
    --message-attribute-names All \
    --query 'Messages[0].MessageId' --output text 2>/dev/null)
  
  if [ -n "$MESSAGES" ] && [ "$MESSAGES" != "None" ]; then
    echo "✅ Message received successfully"
  else
    echo "⚠️  No messages in queue (this is normal if you just started)"
  fi
fi

echo ""
echo "🎉 Test complete!"
echo ""
echo "To run the notifications service:"
echo "1. Set SQS_QUEUE_URL=http://localhost:4566/000000000000/email-notifications-queue in your .env.local"
echo "2. Run: pnpm dev"
