CREATE TABLE "chatbox_conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"context_id" text,
	"title" text NOT NULL,
	"description" text,
	"created_by_user_id" text NOT NULL,
	"last_message_at" timestamp DEFAULT now() NOT NULL,
	"message_count" text DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "chatbox_message" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"user_id" text NOT NULL,
	"character_id" text,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "chatbox_conversation" ADD CONSTRAINT "chatbox_conversation_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbox_message" ADD CONSTRAINT "chatbox_message_conversation_id_chatbox_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chatbox_conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbox_message" ADD CONSTRAINT "chatbox_message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chatbox_conversation_context_idx" ON "chatbox_conversation" USING btree ("context_id");--> statement-breakpoint
CREATE INDEX "chatbox_conversation_last_message_idx" ON "chatbox_conversation" USING btree ("context_id","last_message_at");--> statement-breakpoint
CREATE INDEX "chatbox_message_conversation_idx" ON "chatbox_message" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "chatbox_message_user_idx" ON "chatbox_message" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chatbox_message_created_idx" ON "chatbox_message" USING btree ("conversation_id","created_at");