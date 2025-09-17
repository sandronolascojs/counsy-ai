/// <reference path="./.sst/platform/config.d.ts" />

export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export default $config({
  async app(input) {
    const { APP_CONFIG } = await import('@counsy-ai/types');

    return {
      name: APP_CONFIG.basics.prefix,
      stage: input?.stage ?? 'dev',
      home: 'aws',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      providers: {
        aws: {
          region: 'us-east-1',
          profile: 'sst',
        },
      },
    };
  },

  async run() {
    const { env } = await import('@/config/env.config');
    const { APP_CONFIG } = await import('@counsy-ai/types');
    const isProduction = $app.stage === 'production';

    const APP_NAME = APP_CONFIG.basics.name.toLowerCase().replace(/\s+/g, '-');
    // Normalize FRONTEND_URL into a bare hostname (no scheme/path) for zone names
    const rawFrontendUrl = (env.FRONTEND_URL ?? '').trim();
    let ROOT = rawFrontendUrl;
    try {
      const url = new URL(
        rawFrontendUrl.startsWith('http') ? rawFrontendUrl : `https://${rawFrontendUrl}`,
      );
      ROOT = url.hostname;
    } catch {
      ROOT = rawFrontendUrl
        .replace(/^https?:\/\//i, '')
        .replace(/\/.*$/, '')
        .replace(/\/$/, '');
    }
    const API_ZONE = `api.${ROOT}`; // api.counsy.app   (zone Route 53)
    const APP_ZONE = `app.${ROOT}`; // app.counsy.app   (zone Route 53)

    const API_DOMAIN = isProduction ? `${API_ZONE}` : `${$app.stage}.${API_ZONE}`;
    const FRONT_DOMAIN = isProduction ? `${APP_ZONE}` : `${$app.stage}.${APP_ZONE}`;
    const FRONT_ORIGIN = isProduction ? `https://${APP_ZONE}` : `https://${$app.stage}.${APP_ZONE}`;

    const DB_NAME = `${$app.stage}-${APP_NAME}-db`;
    const VPC_NAME = `${$app.stage}-${APP_NAME}-vpc`;
    const API_NAME = `${$app.stage}-${APP_NAME}-api`;
    const FRONTEND_NAME = `${$app.stage}-${APP_NAME}-frontend`;
    const NOTIFICATIONS_NAME = `${$app.stage}-${APP_NAME}-notifications`;

    const vpc = new sst.aws.Vpc(VPC_NAME, {
      bastion: true,
      nat: 'ec2',
    });

    const db = new sst.aws.Postgres(
      DB_NAME,
      {
        vpc,
        instance: isProduction ? 't4g.small' : 't4g.micro',
        storage: isProduction ? '50 GB' : '20 GB',
        proxy: isProduction,
      },
      {
        version: '16.x',
      },
    );

    // SNS Topic + SQS subscription (recommended: SNS -> SQS -> Lambda)
    const notificationsTopic = new sst.aws.SnsTopic(`${NOTIFICATIONS_NAME}`, {});

    const notificationsQueue = new sst.aws.Queue(`${NOTIFICATIONS_NAME}-queue`);

    notificationsTopic.subscribeQueue('Subscription', notificationsQueue);

    notificationsQueue.subscribe({
      handler: '../../services/notifications/src/index.handler',
      runtime: 'nodejs22.x',
      memory: '1024 MB',
      timeout: '30 seconds',
      link: [db],
      permissions: [
        {
          actions: ['ses:SendEmail', 'ses:SendRawEmail'],
          resources: ['*'],
        },
      ],
      environment: {
        APP_ENV: $app.stage,
        DATABASE_URL: $interpolate`postgresql://${db.username}:${db.password}@${db.host}:${db.port}/${db.database}`,
        FROM_EMAIL: isProduction
          ? $interpolate`no-reply@${ROOT}`
          : $interpolate`no-reply-${$app.stage}@${ROOT}`,
        AWS_REGION: 'us-east-1',
        SES_CONFIGURATION_SET: isProduction ? 'prod-default' : undefined,
      },
    });

    const api = new sst.aws.ApiGatewayV2(API_NAME, {
      vpc,
      domain: {
        name: API_DOMAIN,
        dns: sst.cloudflare.dns(),
      },
      cors: {
        allowOrigins: [FRONT_ORIGIN],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        allowCredentials: true,
        maxAge: '1 day',
        exposeHeaders: Object.keys(securityHeaders),
      },
    });

    api.route('ANY /{proxy+}', {
      handler: '../../services/api/dist/index.handler',
      vpc,
      link: [db],
      runtime: 'nodejs22.x',
      permissions: [
        {
          actions: ['ses:SendEmail', 'ses:SendRawEmail'],
          resources: ['*'],
        },
      ],
      environment: {
        APP_ENV: $app.stage,
        DATABASE_URL: $interpolate`postgresql://${db.username}:${db.password}@${db.host}:${db.port}/${db.database}`,
        ALLOWED_ORIGINS: FRONT_ORIGIN,
        FRONTEND_URL: $interpolate`https://${FRONT_DOMAIN}`,
        API_BASE_URL: $interpolate`https://${API_DOMAIN}`,

        // slack
        SLACK_CLIENT_ID: env.SLACK_CLIENT_ID,
        SLACK_CLIENT_SECRET: env.SLACK_CLIENT_SECRET,
        OAUTH_SCOPES: env.OAUTH_SCOPES,

        // auth
        BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: $interpolate`https://${API_DOMAIN}`,

        // email / ses: compute per-environment
        FROM_EMAIL: isProduction
          ? $interpolate`no-reply@${ROOT}`
          : $interpolate`no-reply-${$app.stage}@${ROOT}`,
        AWS_REGION: 'us-east-1',
        SES_CONFIGURATION_SET: isProduction ? 'prod-default' : undefined,

        // google credentials
        GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,

        // notifications
        NOTIFICATIONS_TOPIC_ARN: notificationsTopic.arn,
      },
    });

    const frontend = new sst.aws.Nextjs(FRONTEND_NAME, {
      path: '../../apps/frontend',
      domain: {
        name: FRONT_DOMAIN,
        dns: sst.cloudflare.dns(),
      },
      environment: {
        NEXT_PUBLIC_API_URL: $interpolate`https://${API_DOMAIN}`,
        NEXT_PUBLIC_AUTH_API_URL: $interpolate`https://${API_DOMAIN}/api/auth`,
        NEXT_PUBLIC_FRONTEND_URL: $interpolate`https://${FRONT_DOMAIN}`,
      },
    });

    return {
      apiUrl: api.url,
      frontendUrl: frontend.url,
      notificationsTopicArn: notificationsTopic.arn,
      notificationsTopicName: notificationsTopic.name,
      databaseUrl: $interpolate`postgresql://${db.username}:${db.password}@${db.host}:${db.port}/${db.database}`,
    };
  },
});
