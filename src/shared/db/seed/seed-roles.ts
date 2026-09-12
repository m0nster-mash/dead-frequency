import {role} from "@/shared/communication/permissions/schema/permissions.schema";
import {db} from "@/shared/db/client";

export async function seedRoles(): Promise<void> {
    await db
        .insert(role)
        .values([
            {id: "user", label: "User"},
            {id: "moderate", label: "Moderator"},
            {id: "admin", label: "Administrator"},
        ])
        .onConflictDoNothing();
}
