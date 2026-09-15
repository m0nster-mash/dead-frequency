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
CREATE TABLE "system_modules" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "system_modules_key_unique" UNIQUE("key")
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
ALTER TABLE "sanction_appeal" ADD CONSTRAINT "sanction_appeal_sanctionId_user_sanction_id_fk" FOREIGN KEY ("sanctionId") REFERENCES "public"."user_sanction"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanction_appeal" ADD CONSTRAINT "sanction_appeal_appellantUserId_user_id_fk" FOREIGN KEY ("appellantUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sanction_appeal" ADD CONSTRAINT "sanction_appeal_reviewedByUserId_user_id_fk" FOREIGN KEY ("reviewedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_profile" ADD CONSTRAINT "character_profile_characterId_character_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."character"("id") ON DELETE cascade ON UPDATE no action;