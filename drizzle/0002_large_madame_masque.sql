DROP INDEX "account_userId_idx";--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "issuer" text DEFAULT 'local' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_id_uidx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");