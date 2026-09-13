CREATE TABLE "chatbox_message" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"character_id" text,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "chatbox_message" ADD CONSTRAINT "chatbox_message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chatbox_message_user_idx" ON "chatbox_message" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chatbox_message_created_idx" ON "chatbox_message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "chatbox_message_created_deleted_idx" ON "chatbox_message" USING btree ("created_at","deleted_at");