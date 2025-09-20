CREATE TABLE "user_preferences" (
	"user_preference_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"locale" "locale" DEFAULT 'en_US' NOT NULL,
	"timezone" timezone DEFAULT 'UTC' NOT NULL,
	"country" "country_code" DEFAULT 'US' NOT NULL,
	"date_format" date_format DEFAULT 'MM/DD/YYYY' NOT NULL,
	"time_format" time_format DEFAULT '12H' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"theme" "theme" DEFAULT 'SYSTEM' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_preference_id_unique" UNIQUE("user_preference_id")
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"notification_preference_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"notification_category" "notification_category" NOT NULL,
	"channel" "notification_transporter" NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notification_preferences_notification_preference_id_unique" UNIQUE("notification_preference_id")
);
--> statement-breakpoint
CREATE TABLE "notification_schedules" (
	"notification_schedule_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"channel" "notification_transporter" NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"timezone" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"weekdays" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notification_schedules_notification_schedule_id_unique" UNIQUE("notification_schedule_id")
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_schedules" ADD CONSTRAINT "notification_schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;