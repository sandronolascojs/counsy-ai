CREATE TYPE "public"."currency" AS ENUM('USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CHF', 'JPY', 'CNY');--> statement-breakpoint
CREATE TYPE "public"."plan_name" AS ENUM('Standard', 'Max');--> statement-breakpoint
CREATE TYPE "public"."subscription_channel" AS ENUM('APPLE_IAP', 'GOOGLE_PLAY', 'STRIPE');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('Active', 'Past Due', 'Pending Payment', 'Pending Cancel', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."device_type" AS ENUM('Android', 'iOS');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('EXPO');--> statement-breakpoint
CREATE TABLE "minute_pack_prices" (
	"minute_pack_price_id" text PRIMARY KEY NOT NULL,
	"minute_pack_product_id" text NOT NULL,
	"unit_amount" integer NOT NULL,
	"store_price_tier" text,
	"effective_from" timestamp NOT NULL,
	"effective_to" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "minute_pack_prices_minute_pack_price_id_unique" UNIQUE("minute_pack_price_id")
);
--> statement-breakpoint
CREATE TABLE "minute_pack_products" (
	"minute_pack_product_id" text PRIMARY KEY NOT NULL,
	"minute_pack_id" text NOT NULL,
	"channel" "subscription_channel" NOT NULL,
	"external_product_id" text NOT NULL,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "minute_pack_products_minute_pack_product_id_unique" UNIQUE("minute_pack_product_id")
);
--> statement-breakpoint
CREATE TABLE "minute_pack_purchases" (
	"minute_pack_purchase_id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"minute_pack_id" text NOT NULL,
	"external_id" text NOT NULL,
	"channel" "subscription_channel" NOT NULL,
	"minutes_granted" integer NOT NULL,
	"minutes_used" integer DEFAULT 0,
	"purchased_at" timestamp NOT NULL,
	"refunded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "minute_pack_purchases_minute_pack_purchase_id_unique" UNIQUE("minute_pack_purchase_id")
);
--> statement-breakpoint
CREATE TABLE "minute_packs" (
	"minute_pack_id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"minutes" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "minute_packs_minute_pack_id_unique" UNIQUE("minute_pack_id")
);
--> statement-breakpoint
CREATE TABLE "plan_channel_prices" (
	"plan_channel_price_id" text PRIMARY KEY NOT NULL,
	"plan_channel_product_id" text NOT NULL,
	"unit_amount" integer NOT NULL,
	"store_price_tier" text,
	"effective_from" timestamp NOT NULL,
	"effective_to" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plan_channel_prices_plan_channel_price_id_unique" UNIQUE("plan_channel_price_id")
);
--> statement-breakpoint
CREATE TABLE "plan_channel_products" (
	"plan_channel_product_id" text PRIMARY KEY NOT NULL,
	"plan_id" text,
	"channel" "subscription_channel" NOT NULL,
	"external_product_id" text NOT NULL,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plan_channel_products_plan_channel_product_id_unique" UNIQUE("plan_channel_product_id")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"plan_id" text PRIMARY KEY NOT NULL,
	"name" "plan_name" NOT NULL,
	"minutes_included" integer NOT NULL,
	"features" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plans_plan_id_unique" UNIQUE("plan_id")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"subscription_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"channel" "subscription_channel" NOT NULL,
	"external_id" text,
	"status" "subscription_status" NOT NULL,
	"started_at" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"cancelled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_subscription_id_unique" UNIQUE("subscription_id")
);
--> statement-breakpoint
CREATE TABLE "cloud_conversation_meta" (
	"cloud_conversation_meta_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"object_key" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"sha256" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cloud_conversation_meta_cloud_conversation_meta_id_unique" UNIQUE("cloud_conversation_meta_id")
);
--> statement-breakpoint
CREATE TABLE "encryption_keys" (
	"encryption_key_id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"wrapped_key" text NOT NULL,
	"kdf_salt" text NOT NULL,
	"kdf_memory" integer NOT NULL,
	"kdf_iterations" integer NOT NULL,
	"kdf_parallelism" smallint NOT NULL,
	"checksum" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "encryption_keys_encryption_key_id_unique" UNIQUE("encryption_key_id")
);
--> statement-breakpoint
CREATE TABLE "referral_codes" (
	"referral_code_id" text PRIMARY KEY NOT NULL,
	"owner_user_id" text NOT NULL,
	"code" text NOT NULL,
	"referral_code_slug" text NOT NULL,
	"disabled" boolean DEFAULT false,
	"disabled_at" timestamp,
	"max_redemptions" integer,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referral_codes_referral_code_id_unique" UNIQUE("referral_code_id")
);
--> statement-breakpoint
CREATE TABLE "referral_minute_grants" (
	"referral_minute_grant_id" text PRIMARY KEY NOT NULL,
	"referral_redemption_id" text NOT NULL,
	"user_id" text NOT NULL,
	"minutes_granted" integer DEFAULT 10 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referral_minute_grants_referral_minute_grant_id_unique" UNIQUE("referral_minute_grant_id")
);
--> statement-breakpoint
CREATE TABLE "referral_redemptions" (
	"referral_redemption_id" text PRIMARY KEY NOT NULL,
	"referral_code_id" text NOT NULL,
	"referred_user_id" text NOT NULL,
	"redeemed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referral_redemptions_referral_redemption_id_unique" UNIQUE("referral_redemption_id")
);
--> statement-breakpoint
CREATE TABLE "voice_sessions" (
	"voice_session_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"duration_sec" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "voice_sessions_voice_session_id_unique" UNIQUE("voice_session_id")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "push_tokens" (
	"push_token_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"platform" "platform" DEFAULT 'EXPO' NOT NULL,
	"device_type" "device_type" NOT NULL,
	"token" text NOT NULL,
	"device_id" text NOT NULL,
	"device_name" text,
	"device_model" text,
	"os_version" text,
	"app_version" text,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "push_tokens_push_token_id_unique" UNIQUE("push_token_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_id_unique" UNIQUE("id"),
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verifications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "minute_pack_prices" ADD CONSTRAINT "minute_pack_prices_minute_pack_product_id_minute_pack_products_minute_pack_product_id_fk" FOREIGN KEY ("minute_pack_product_id") REFERENCES "public"."minute_pack_products"("minute_pack_product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minute_pack_products" ADD CONSTRAINT "minute_pack_products_minute_pack_id_minute_packs_minute_pack_id_fk" FOREIGN KEY ("minute_pack_id") REFERENCES "public"."minute_packs"("minute_pack_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minute_pack_purchases" ADD CONSTRAINT "minute_pack_purchases_subscription_id_subscriptions_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("subscription_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minute_pack_purchases" ADD CONSTRAINT "minute_pack_purchases_minute_pack_id_minute_packs_minute_pack_id_fk" FOREIGN KEY ("minute_pack_id") REFERENCES "public"."minute_packs"("minute_pack_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minute_packs" ADD CONSTRAINT "minute_packs_plan_id_plans_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("plan_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_channel_prices" ADD CONSTRAINT "plan_channel_prices_plan_channel_product_id_plan_channel_products_plan_channel_product_id_fk" FOREIGN KEY ("plan_channel_product_id") REFERENCES "public"."plan_channel_products"("plan_channel_product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_channel_products" ADD CONSTRAINT "plan_channel_products_plan_id_plans_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("plan_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("plan_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cloud_conversation_meta" ADD CONSTRAINT "cloud_conversation_meta_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encryption_keys" ADD CONSTRAINT "encryption_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_minute_grants" ADD CONSTRAINT "referral_minute_grants_referral_redemption_id_referral_redemptions_referral_redemption_id_fk" FOREIGN KEY ("referral_redemption_id") REFERENCES "public"."referral_redemptions"("referral_redemption_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_minute_grants" ADD CONSTRAINT "referral_minute_grants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_redemptions" ADD CONSTRAINT "referral_redemptions_referral_code_id_referral_codes_referral_code_id_fk" FOREIGN KEY ("referral_code_id") REFERENCES "public"."referral_codes"("referral_code_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_redemptions" ADD CONSTRAINT "referral_redemptions_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_sessions" ADD CONSTRAINT "voice_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_minute_pack_prices_temporal_unique" ON "minute_pack_prices" USING btree ("minute_pack_product_id","effective_from") WHERE "minute_pack_prices"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_minute_pack_products_minute_pack_id_channel_unique" ON "minute_pack_products" USING btree ("minute_pack_id","channel");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_minute_pack_products_external_product_id_unique" ON "minute_pack_products" USING btree ("external_product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_minute_pack_purchases_subscription_id_minute_pack_id_external_id_unique" ON "minute_pack_purchases" USING btree ("subscription_id","minute_pack_id","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_minute_packs_plan_id_minutes_unique" ON "minute_packs" USING btree ("plan_id","minutes");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_plan_channel_prices_plan_channel_product_id_unique" ON "plan_channel_prices" USING btree ("plan_channel_product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_plan_channel_products_plan_id_channel_unique" ON "plan_channel_products" USING btree ("plan_id","channel");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_plan_channel_products_external_product_id_unique" ON "plan_channel_products" USING btree ("external_product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_plans_name_unique" ON "plans" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_subscriptions_user_external_unique" ON "subscriptions" USING btree ("user_id","external_id");--> statement-breakpoint
CREATE INDEX "idx_cloud_conversation_meta_user_id" ON "cloud_conversation_meta" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_cloud_conversation_meta_object_key" ON "cloud_conversation_meta" USING btree ("object_key");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_encryption_keys_user_id_unique" ON "encryption_keys" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_referral_codes_code" ON "referral_codes" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_referral_codes_referral_code_slug" ON "referral_codes" USING btree ("referral_code_slug");--> statement-breakpoint
CREATE INDEX "idx_referral_minute_grants_referral_redemption_id_user_id" ON "referral_minute_grants" USING btree ("referral_redemption_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_referral_redemptions_referral_code_id_referred_user_id" ON "referral_redemptions" USING btree ("referral_code_id","referred_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_voice_sessions_user_id_started_at_unique" ON "voice_sessions" USING btree ("user_id","started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_push_tokens_user_id_device" ON "push_tokens" USING btree ("user_id","device_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_push_tokens_token" ON "push_tokens" USING btree ("token");