CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"password" text,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"bypassesCooldown" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"bio" text,
	"bannerUrl" text,
	"themeConfig" jsonb,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profile_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"userId" text NOT NULL,
	"roleId" text NOT NULL,
	"assignedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_role_userId_roleId_pk" PRIMARY KEY("userId","roleId")
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"userId" text PRIMARY KEY NOT NULL,
	"forumPostCount" integer DEFAULT 0 NOT NULL,
	"chatMessageCount" integer DEFAULT 0 NOT NULL,
	"chatboxMessageCount" integer DEFAULT 0 NOT NULL,
	"commentCount" integer DEFAULT 0 NOT NULL,
	"trustScore" integer DEFAULT 0 NOT NULL,
	"lastPostedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module_config" (
	"moduleKey" text PRIMARY KEY NOT NULL,
	"isEnabled" boolean DEFAULT true NOT NULL,
	"maintenanceMessage" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sanction_appeal" (
	"id" text PRIMARY KEY NOT NULL,
	"sanctionId" text NOT NULL,
	"appellantUserId" text NOT NULL,
	"appealText" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"reviewedByUserId" text,
	"reviewNote" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"reviewedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_sanction" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"issuedByUserId" text NOT NULL,
	"sanctionType" text NOT NULL,
	"targetModule" text,
	"contextId" text,
	"reason" text NOT NULL,
	"expiresAt" timestamp,
	"isRevoked" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit-log" (
	"id" text PRIMARY KEY NOT NULL,
	"actorUserId" text NOT NULL,
	"actionType" text NOT NULL,
	"targetModule" text,
	"targetRecordId" text,
	"targetUserId" text,
	"metadata" jsonb,
	"ipAddress" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" text PRIMARY KEY NOT NULL,
	"targetModule" text NOT NULL,
	"targetRecordId" text NOT NULL,
	"reporterUserId" text NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"resolvedByUserId" text,
	"resolutionNote" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"resolvedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "word_filter" (
	"id" text PRIMARY KEY NOT NULL,
	"pattern" text NOT NULL,
	"matchMode" text DEFAULT 'EXACT' NOT NULL,
	"action" text DEFAULT 'REPLACE' NOT NULL,
	"replacement" text DEFAULT '***',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_modules" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "system_modules_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "avatar" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"characterId" text,
	"layerConfig" jsonb NOT NULL,
	"rasterUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "avatar_userId_unique" UNIQUE("userId"),
	CONSTRAINT "avatar_characterId_unique" UNIQUE("characterId")
);
--> statement-breakpoint
CREATE TABLE "character" (
	"id" text PRIMARY KEY NOT NULL,
	"ownerUserId" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "character_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"characterId" text NOT NULL,
	"bio" text,
	"themeConfig" jsonb,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "character_profile_characterId_unique" UNIQUE("characterId")
);
--> statement-breakpoint
CREATE TABLE "chatbox_message" (
	"id" text PRIMARY KEY NOT NULL,
	"contextId" text,
	"userId" text NOT NULL,
	"characterId" text,
	"message" text NOT NULL,
	"isPinned" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "forum_board" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"boardType" text DEFAULT 'STANDARD' NOT NULL,
	"allowsCharacterPosting" boolean DEFAULT true NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum_category" (
	"id" text PRIMARY KEY NOT NULL,
	"contextId" text,
	"name" text NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum_post" (
	"id" text PRIMARY KEY NOT NULL,
	"threadId" text NOT NULL,
	"userId" text NOT NULL,
	"characterId" text,
	"content" text NOT NULL,
	"replyToPostId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "forum_thread" (
	"id" text PRIMARY KEY NOT NULL,
	"boardId" text NOT NULL,
	"userId" text NOT NULL,
	"characterId" text,
	"title" text NOT NULL,
	"isPinned" boolean DEFAULT false NOT NULL,
	"isLocked" boolean DEFAULT false NOT NULL,
	"postCount" integer DEFAULT 1 NOT NULL,
	"lastPostAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_roleId_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanction_appeal" ADD CONSTRAINT "sanction_appeal_sanctionId_user_sanction_id_fk" FOREIGN KEY ("sanctionId") REFERENCES "public"."user_sanction"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanction_appeal" ADD CONSTRAINT "sanction_appeal_appellantUserId_user_id_fk" FOREIGN KEY ("appellantUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanction_appeal" ADD CONSTRAINT "sanction_appeal_reviewedByUserId_user_id_fk" FOREIGN KEY ("reviewedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sanction" ADD CONSTRAINT "user_sanction_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sanction" ADD CONSTRAINT "user_sanction_issuedByUserId_user_id_fk" FOREIGN KEY ("issuedByUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit-log" ADD CONSTRAINT "audit-log_actorUserId_user_id_fk" FOREIGN KEY ("actorUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit-log" ADD CONSTRAINT "audit-log_targetUserId_user_id_fk" FOREIGN KEY ("targetUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reporterUserId_user_id_fk" FOREIGN KEY ("reporterUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_resolvedByUserId_user_id_fk" FOREIGN KEY ("resolvedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_profile" ADD CONSTRAINT "character_profile_characterId_character_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_board" ADD CONSTRAINT "forum_board_categoryId_forum_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."forum_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_threadId_forum_thread_id_fk" FOREIGN KEY ("threadId") REFERENCES "public"."forum_thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_replyToPostId_forum_post_id_fk" FOREIGN KEY ("replyToPostId") REFERENCES "public"."forum_post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_thread" ADD CONSTRAINT "forum_thread_boardId_forum_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."forum_board"("id") ON DELETE cascade ON UPDATE no action;