CREATE TYPE "public"."mod_action" AS ENUM('edit', 'delete', 'mute', 'unmute', 'shadowban', 'ban', 'unban', 'pin', 'unpin');--> statement-breakpoint
CREATE TYPE "public"."module_name" AS ENUM('forum', 'chatbox', 'chatroom', 'dm', 'avatar_elements', 'blog', 'comment', 'site');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('mention', 'dm', 'mod_action', 'reply', 'comment', 'guild_invite');--> statement-breakpoint
CREATE TYPE "public"."posting_status" AS ENUM('active', 'muted', 'shadowbanned', 'banned');--> statement-breakpoint
CREATE TYPE "public"."report_reason" AS ENUM('spam', 'harassment', 'inappropriate_content', 'impersonation', 'other');--> statement-breakpoint
CREATE TABLE "account" (
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
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"is_anonymous" boolean DEFAULT false,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "avatar_config" (
	"user_id" text PRIMARY KEY NOT NULL,
	"config" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum_board" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"context_id" text,
	"allows_character_posting" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum_category" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum_post" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"user_id" text NOT NULL,
	"character_id" text,
	"body" text NOT NULL,
	"reply_to_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "forum_thread" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"user_id" text NOT NULL,
	"character_id" text,
	"title" text NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"locked" boolean DEFAULT false NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"last_post_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role_id" text NOT NULL,
	"context_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"module" "module_name" NOT NULL,
	"record_id" text NOT NULL,
	"action" "mod_action" NOT NULL,
	"moderator_id" text NOT NULL,
	"target_user_id" text,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mention" (
	"id" text PRIMARY KEY NOT NULL,
	"module" "module_name" NOT NULL,
	"record_id" text NOT NULL,
	"mentioned_user_id" text NOT NULL,
	"mentioned_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"payload" jsonb,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "activity_event" (
	"id" text PRIMARY KEY NOT NULL,
	"module" "module_name" NOT NULL,
	"record_id" text NOT NULL,
	"event_type" text NOT NULL,
	"actor_id" text NOT NULL,
	"payload" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" text PRIMARY KEY NOT NULL,
	"module" "module_name" NOT NULL,
	"record_id" text NOT NULL,
	"user_id" text NOT NULL,
	"character_id" text,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reaction" (
	"id" text PRIMARY KEY NOT NULL,
	"module" "module_name" NOT NULL,
	"record_id" text NOT NULL,
	"user_id" text NOT NULL,
	"character_id" text,
	"emoji" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" text PRIMARY KEY NOT NULL,
	"module" "module_name" NOT NULL,
	"record_id" text NOT NULL,
	"reporter_id" text NOT NULL,
	"reason" "report_reason" NOT NULL,
	"details" text,
	"resolved" text DEFAULT 'open',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"subscriber_id" text NOT NULL,
	"module" "module_name" NOT NULL,
	"record_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_block" (
	"blocker_id" text NOT NULL,
	"blocked_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_block_blocker_id_blocked_id_pk" PRIMARY KEY("blocker_id","blocked_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avatar_config" ADD CONSTRAINT "avatar_config_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_board" ADD CONSTRAINT "forum_board_category_id_forum_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."forum_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_thread_id_forum_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."forum_thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_reply_to_user_id_user_id_fk" FOREIGN KEY ("reply_to_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_thread" ADD CONSTRAINT "forum_thread_board_id_forum_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."forum_board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_thread" ADD CONSTRAINT "forum_thread_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_moderator_id_user_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_target_user_id_user_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mention" ADD CONSTRAINT "mention_mentioned_user_id_user_id_fk" FOREIGN KEY ("mentioned_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mention" ADD CONSTRAINT "mention_mentioned_by_user_id_user_id_fk" FOREIGN KEY ("mentioned_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_status" ADD CONSTRAINT "user_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_event" ADD CONSTRAINT "activity_event_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_id_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscriber_id_user_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_blocker_id_user_id_fk" FOREIGN KEY ("blocker_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_blocked_id_user_id_fk" FOREIGN KEY ("blocked_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "forum_board_category_idx" ON "forum_board" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "forum_post_thread_idx" ON "forum_post" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "forum_thread_board_idx" ON "forum_thread" USING btree ("board_id");--> statement-breakpoint
CREATE INDEX "forum_thread_last_post_idx" ON "forum_thread" USING btree ("board_id","last_post_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_role_user_context_unique_idx" ON "user_role" USING btree ("user_id","role_id","context_id") WHERE "user_role"."context_id"
            IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_role_user_global_unique_idx" ON "user_role" USING btree ("user_id","role_id") WHERE "user_role"."context_id"
            IS NULL;--> statement-breakpoint
CREATE INDEX "audit_log_module_record_idx" ON "audit_log" USING btree ("module","record_id");--> statement-breakpoint
CREATE INDEX "audit_log_moderator_idx" ON "audit_log" USING btree ("moderator_id");--> statement-breakpoint
CREATE INDEX "audit_log_target_user_idx" ON "audit_log" USING btree ("target_user_id");--> statement-breakpoint
CREATE INDEX "mention_module_record_idx" ON "mention" USING btree ("module","record_id");--> statement-breakpoint
CREATE INDEX "mention_mentioned_user_idx" ON "mention" USING btree ("mentioned_user_id");--> statement-breakpoint
CREATE INDEX "notification_user_read_idx" ON "notification" USING btree ("user_id","read");--> statement-breakpoint
CREATE UNIQUE INDEX "user_status_user_module_unique_idx" ON "user_status" USING btree ("user_id","module") WHERE "user_status"."module"
            IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_status_user_global_unique_idx" ON "user_status" USING btree ("user_id") WHERE "user_status"."module"
            IS NULL;--> statement-breakpoint
CREATE INDEX "user_status_user_idx" ON "user_status" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "activity_event_created_idx" ON "activity_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "comment_module_record_idx" ON "comment" USING btree ("module","record_id");--> statement-breakpoint
CREATE INDEX "reaction_module_record_idx" ON "reaction" USING btree ("module","record_id");--> statement-breakpoint
CREATE INDEX "report_module_record_idx" ON "report" USING btree ("module","record_id");--> statement-breakpoint
CREATE INDEX "subscription_subscriber_idx" ON "subscription" USING btree ("subscriber_id");--> statement-breakpoint
CREATE INDEX "subscription_module_record_idx" ON "subscription" USING btree ("module","record_id");