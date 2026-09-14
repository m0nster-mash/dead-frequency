CREATE TABLE "auditLog" (
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
CREATE TABLE "module_config" (
	"moduleKey" text PRIMARY KEY NOT NULL,
	"isEnabled" boolean DEFAULT true NOT NULL,
	"maintenanceMessage" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "word_filter" (
	"id" text PRIMARY KEY NOT NULL,
	"pattern" text NOT NULL,
	"matchMode" text DEFAULT 'EXACT' NOT NULL,
	"action" text DEFAULT 'REPLACE' NOT NULL,
	"replacement" text DEFAULT '***',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auditLog" ADD CONSTRAINT "auditLog_actorUserId_user_id_fk" FOREIGN KEY ("actorUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auditLog" ADD CONSTRAINT "auditLog_targetUserId_user_id_fk" FOREIGN KEY ("targetUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reporterUserId_user_id_fk" FOREIGN KEY ("reporterUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_resolvedByUserId_user_id_fk" FOREIGN KEY ("resolvedByUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sanction" ADD CONSTRAINT "user_sanction_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sanction" ADD CONSTRAINT "user_sanction_issuedByUserId_user_id_fk" FOREIGN KEY ("issuedByUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;