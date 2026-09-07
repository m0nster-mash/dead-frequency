ALTER TYPE "public"."module_name" ADD VALUE 'site';--> statement-breakpoint
DROP INDEX "user_role_unique_idx";--> statement-breakpoint
DROP INDEX "user_status_unique_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "user_role_unique_idx" ON "user_role" USING btree ("user_id","role_id",COALESCE(
            "context_id",
            ''
            ));--> statement-breakpoint
CREATE UNIQUE INDEX "user_status_unique_idx" ON "user_status" USING btree ("user_id","module",COALESCE(
            "module",
            ''
            ));