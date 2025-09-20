#!/bin/sh

set -e

# Configure AWS CLI
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localstack:4566

# Queue names from QueueNames enum (space-separated list)
QUEUE_NAMES="notifications"

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

# Function to list existing queues
list_queues() {
  echo "📋 Listing existing queues..."
  aws sqs list-queues --endpoint-url http://localstack:4566 --query 'QueueUrls[]' --output table || echo "No queues found or error listing queues"
  echo ""
}

# Function to create a queue (idempotent)
create_queue() {
  queue_name=$1
  echo "Creating SQS queue: $queue_name" 1>&2

  # Try to get existing URL first
  existing_url=$(aws sqs get-queue-url --queue-name "$queue_name" --endpoint-url http://localstack:4566 --query 'QueueUrl' --output text 2>/dev/null || true)

  if [ -n "${existing_url}" ] && [ "${existing_url}" != "None" ]; then
    echo "ℹ️  Queue already exists: ${existing_url}" 1>&2
    echo "${existing_url}"
    return 0
  fi

  # Create queue
  queue_url=$(aws sqs create-queue \
    --queue-name "$queue_name" \
    --endpoint-url http://localstack:4566 \
    --query 'QueueUrl' --output text)

  echo "📬 SQS Queue URL: $queue_url" 1>&2

  # Verify queue is retrievable (retry a few times as LocalStack may be eventually consistent)
  for i in 1 2 3 4 5 6 7 8 9 10; do
    verify=$(aws sqs get-queue-url --queue-name "$queue_name" --endpoint-url http://localstack:4566 --query 'QueueUrl' --output text 2>/dev/null || true)
    if [ -n "$verify" ] && [ "$verify" != "None" ]; then
      echo "✅ Verified queue availability: $verify" 1>&2
      echo "$verify"
      return 0
    fi
    echo "⏳ Waiting for queue to be available (attempt $i/10)" 1>&2
    sleep 1
  done

  echo "❌ Queue did not become available in time" 1>&2
  echo "$queue_url"
}

# Function to get queue ARN
get_queue_arn() {
  q_url=$1
  # Retry to handle eventual consistency after create-queue
  i=1
  while [ $i -le 10 ]; do
    q_arn=$(aws sqs get-queue-attributes --queue-url "$q_url" --attribute-names QueueArn --endpoint-url http://localstack:4566 --query 'Attributes.QueueArn' --output text 2>/dev/null || true)
    if [ -n "$q_arn" ] && [ "$q_arn" != "None" ]; then
      echo "$q_arn"
      return 0
    fi
    echo "⏳ Waiting for queue ARN (attempt $i/10)" 1>&2
    i=$((i+1))
    sleep 1
  done
  echo "" 
}

# List existing queues before setup
list_queues

# Create SNS topic
echo "Creating SNS topic..."
TOPIC_ARN=$(aws sns create-topic --name notifications-topic --endpoint-url http://localstack:4566 --query 'TopicArn' --output text)
echo "📧 SNS Topic ARN: $TOPIC_ARN"

# Create queues from enum
QUEUE_URLS=""
QUEUE_ARNS=""
NOTIF_QUEUE_URL=""
NOTIF_QUEUE_ARN=""

for queue_name in $QUEUE_NAMES; do
  q_url=$(create_queue "$queue_name")
  q_arn=$(get_queue_arn "$q_url")

  QUEUE_URLS="$QUEUE_URLS $q_url"
  QUEUE_ARNS="$QUEUE_ARNS $q_arn"
  if [ "$queue_name" = "notifications" ]; then
    NOTIF_QUEUE_URL="$q_url"
    NOTIF_QUEUE_ARN="$q_arn"
  fi

  if [ -n "$q_arn" ]; then
    echo "Queue ARN: $q_arn"
  else
    echo "⚠️  Queue ARN not yet available for $queue_name" 1>&2
  fi
  echo "" 1>&2
done

# Set up SNS-SQS integration for notifications queue
case " $QUEUE_NAMES " in
  *" notifications "*)
  notifications_queue_url="$NOTIF_QUEUE_URL"
  notifications_queue_arn="$NOTIF_QUEUE_ARN"

  if [ -z "$notifications_queue_url" ] || [ -z "$notifications_queue_arn" ]; then
    echo "⚠️  ARN not resolved, deriving LocalStack ARN from URL"
    # Derive ARN from URL for LocalStack: arn:aws:sqs:<region>:000000000000:<queue-name>
    notif_name=$(echo "$NOTIF_QUEUE_URL" | awk -F/ '{print $NF}')
    if [ -n "$notif_name" ]; then
      notifications_queue_arn="arn:aws:sqs:us-east-1:000000000000:$notif_name"
      echo "Derived notifications queue ARN: $notifications_queue_arn"
    else
      echo "❌ Failed to resolve notifications queue URL/ARN"
      exit 255
    fi
  fi
  
  echo "Setting up SNS-SQS integration for notifications queue..."
  
  # Create SQS policy to allow SNS to send messages
  echo "Setting SQS policy for notifications queue..."
  POLICY_JSON=$(cat <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "sns.amazonaws.com" },
      "Action": "sqs:SendMessage",
      "Resource": "REPLACE_QUEUE_ARN",
      "Condition": { "ArnEquals": { "aws:SourceArn": "REPLACE_TOPIC_ARN" } }
    }
  ]
}
EOF
)
  POLICY_JSON=$(echo "$POLICY_JSON" | sed "s|REPLACE_QUEUE_ARN|$notifications_queue_arn|g" | sed "s|REPLACE_TOPIC_ARN|$TOPIC_ARN|g")
  POLICY_ESCAPED=$(printf '%s' "$POLICY_JSON" | tr -d '\n' | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
  ATTR_FILE=/tmp/sqs-attrs.json
  cat > "$ATTR_FILE" <<EOF
{
  "QueueUrl": "$notifications_queue_url",
  "Attributes": {
    "Policy": "$POLICY_ESCAPED"
  }
}
EOF
  aws sqs set-queue-attributes \
    --cli-input-json file://$ATTR_FILE \
    --endpoint-url http://localstack:4566

  # Subscribe SQS to SNS
  echo "Subscribing notifications queue to SNS..."
  SUBSCRIPTION_ARN=$(aws sns subscribe \
    --topic-arn "$TOPIC_ARN" \
    --protocol sqs \
    --notification-endpoint "$notifications_queue_arn" \
    --endpoint-url http://localstack:4566 \
    --query 'SubscriptionArn' \
    --output text)

  echo "Subscription ARN: $SUBSCRIPTION_ARN"

  # Ensure raw message delivery so SQS receives the original message body and SNS attributes
  echo "Enabling RawMessageDelivery on subscription..."
  aws sns set-subscription-attributes \
    --subscription-arn "$SUBSCRIPTION_ARN" \
    --attribute-name RawMessageDelivery \
    --attribute-value true \
    --endpoint-url http://localstack:4566

  echo "🔍 Validating SNS subscription exists..."
  aws sns list-subscriptions-by-topic \
    --topic-arn "$TOPIC_ARN" \
    --endpoint-url http://localstack:4566 | cat

  echo "🔍 Inspecting SQS queue attributes (including Policy) ..."
  # retry attributes read briefly in case of eventual consistency
  for i in 1 2 3 4 5; do
    if aws sqs get-queue-attributes \
      --queue-url "$notifications_queue_url" \
      --attribute-names All \
      --endpoint-url http://localstack:4566 | cat; then
      break
    fi
    echo "⏳ Retrying get-queue-attributes ($i/5)"
    sleep 1
  done

  # Optional end-to-end SNS→SQS delivery test
  # Set TEST_SNS_SQS=1 in environment to enable (default: disabled)
  if [ "${TEST_SNS_SQS:-0}" = "1" ]; then
    echo "🧪 Running optional SNS→SQS delivery test (TEST_SNS_SQS=1)"
    TEST_MSG_ID=$(aws sns publish \
      --endpoint-url http://localstack:4566 \
      --topic-arn "$TOPIC_ARN" \
      --message '{"userId":"ls-test","notificationType":"RESET_PASSWORD","transporterType":"MAIL","additionalData":{"resetPasswordUrl":"https://example.com"}}' \
      --message-attributes 'queue={DataType=String,StringValue=notifications},userId={DataType=String,StringValue=ls-test},eventType={DataType=String,StringValue=RESET_PASSWORD},eventVersion={DataType=String,StringValue=1.0},source={DataType=String,StringValue=aws-init},correlationId={DataType=String,StringValue=init},requestId={DataType=String,StringValue=init}' \
      --query 'MessageId' --output text || true)
    if [ -n "$TEST_MSG_ID" ] && [ "$TEST_MSG_ID" != "None" ]; then
      echo "✅ Test SNS message published: $TEST_MSG_ID"
      echo "⏳ Waiting 2s for delivery to SQS..."
      sleep 2
      aws sqs receive-message \
        --endpoint-url http://localstack:4566 \
        --queue-url "$notifications_queue_url" \
        --max-number-of-messages 1 \
        --message-attribute-names All | cat || true
    else
      echo "⚠️  Failed to publish test SNS message"
    fi
  else
    echo "ℹ️  Skipping SNS→SQS test publish (set TEST_SNS_SQS=1 to enable)"
  fi
  ;;
esac

# List queues after setup
echo ""
echo "📋 Final queue status:"
list_queues

echo ""
echo "✅ Setup complete!"
echo "📧 SNS Topic ARN: $TOPIC_ARN"
echo "📬 Created queues: $QUEUE_NAMES"
echo "   URLs: $QUEUE_URLS"
echo "   ARNs: $QUEUE_ARNS"
case " $QUEUE_NAMES " in
  *" notifications "*)
  echo "🔗 SNS-SQS Subscription ARN: $SUBSCRIPTION_ARN"
  ;;
esac
echo ""
