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
DROP TABLE "auditLog" CASCADE;--> statement-breakpoint
ALTER TABLE "audit-log" ADD CONSTRAINT "audit-log_actorUserId_user_id_fk" FOREIGN KEY ("actorUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit-log" ADD CONSTRAINT "audit-log_targetUserId_user_id_fk" FOREIGN KEY ("targetUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;