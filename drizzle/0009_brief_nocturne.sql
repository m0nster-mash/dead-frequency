CREATE TYPE "public"."posting_status" AS ENUM('active', 'muted', 'shadowbanned', 'banned');--> statement-breakpoint
CREATE TYPE "public"."trust_level" AS ENUM('new', 'basic', 'trusted', 'veteran', 'restricted');--> statement-breakpoint
CREATE TABLE "user_status" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"module" "module_name",
	"status" "posting_status" DEFAULT 'active' NOT NULL,
	"reason" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_trust" (
	"user_id" text PRIMARY KEY NOT NULL,
	"trust_level" "trust_level" DEFAULT 'new' NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"negative_signal_count" integer DEFAULT 0 NOT NULL,
	"cooldown_until" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_status" ADD CONSTRAINT "user_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_trust" ADD CONSTRAINT "user_trust_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_status_unique_idx" ON "user_status" USING btree ("user_id","module");--> statement-breakpoint
CREATE INDEX "user_status_user_idx" ON "user_status" USING btree ("user_id");