CREATE TYPE "public"."trust_level" AS ENUM('new', 'basic', 'trusted', 'veteran', 'restricted');--> statement-breakpoint
CREATE TABLE "user_trust" (
	"user_id" text PRIMARY KEY NOT NULL,
	"trust_level" "trust_level" DEFAULT 'new' NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"negative_signal_count" integer DEFAULT 0 NOT NULL,
	"cooldown_until" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_trust" ADD CONSTRAINT "user_trust_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;