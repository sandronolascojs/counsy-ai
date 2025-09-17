## Local SNS (via LocalStack)

1. Start LocalStack + Postgres

   docker compose up -d localstack db

2. Get the topic ARN

   docker compose logs localstack | grep 'SNS topic ARN'

   Or exec:

   docker compose exec localstack awslocal sns list-topics --query 'Topics[0].TopicArn' --output text

3. Set env for API (.env.local)

   AWS_REGION=us-east-1
   NOTIFICATIONS_TOPIC_ARN=arn:aws:sns:us-east-1:000000000000:notifications-topic

4. Run API

   pnpm --filter @counsy-ai/api dev

# API Service

This service provides the REST API for the Auto Articles platform. It exposes endpoints for managing and retrieving articles and categories, supporting multi-site content delivery and integration with the frontend and other services.

See the [root README](../../README.md) for a high-level overview of the monorepo and its architecture.

---

## Features

- Fastify-based REST API
- Endpoints for articles and categories
- Pagination, search, and filtering support
- Designed for multi-site content delivery
- TypeScript, modular code, and SOLID principles

---

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Set environment variables:**
   - Configure required environment variables as needed
3. **Run the API server:**
   ```bash
   pnpm dev
   ```

---

## License

This service is licensed for commercial use. See the root README for more details.
