import type { Logger } from '@counsy-ai/shared';
import { NotificationEventType } from '@counsy-ai/types';
import type { NotificationHandlerMap } from '../types';
import {
  MagicLinkMailHandler,
  ResetPasswordMailHandler,
  SubscriptionActiveMailHandler,
  SubscriptionPastDueMailHandler,
  Trial3DaysLeftMailHandler,
  TrialEndMailHandler,
  TrialStartMailHandler,
  WelcomeMailHandler,
} from './handlers';

export const createMailHandlers = (logger: Logger): NotificationHandlerMap => ({
  [NotificationEventType.WELCOME]: new WelcomeMailHandler(logger),
  [NotificationEventType.TRIAL_START]: new TrialStartMailHandler(logger),
  [NotificationEventType.TRIAL_3D_LEFT]: new Trial3DaysLeftMailHandler(logger),
  [NotificationEventType.TRIAL_END]: new TrialEndMailHandler(logger),
  [NotificationEventType.SUBSCRIPTION_ACTIVE]: new SubscriptionActiveMailHandler(logger),
  [NotificationEventType.SUBSCRIPTION_PAST_DUE]: new SubscriptionPastDueMailHandler(logger),
  [NotificationEventType.RESET_PASSWORD]: new ResetPasswordMailHandler(logger),
  [NotificationEventType.MAGIC_LINK]: new MagicLinkMailHandler(logger),
});
