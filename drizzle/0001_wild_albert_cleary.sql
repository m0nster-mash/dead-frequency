DROP INDEX "account_provider_account_id_uidx";--> statement-breakpoint
DROP INDEX "account_user_id_idx";--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");