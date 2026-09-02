ALTER TABLE "user_role" DROP CONSTRAINT "user_role_user_id_role_id_context_id_pk";--> statement-breakpoint
ALTER TABLE "user_role" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_role_unique_idx" ON "user_role" USING btree ("user_id","role_id",COALESCE("context_id", ''));