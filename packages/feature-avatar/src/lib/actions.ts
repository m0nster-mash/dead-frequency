// "use server";
//
// import {eq} from "drizzle-orm";
// import {headers} from "next/headers";
// import {avatar} from "../schema/avatar.schema";
// import {AvatarConfig} from "./types";
// import {validateAvatarConfig} from "./validation";
//
// /**
//  * Union response type mapping operation success boundaries for saving configurations.
//  */
// export type SaveAvatarConfigResult =
//     | { success: true; config: AvatarConfig }
//     | { success: false; error: string };
//
// /**
//  * An asynchronous Next.js Server Action that securely processes and persists an avatar configuration layout.
//  *
//  * @param {unknown} input - Raw untrusted data payload captured from client components or form inputs.
//  *
//  * @returns {Promise<SaveAvatarConfigResult>} A structured operation outcome dictionary carrying updated configurations
//  *                                            or strings.
//  */
// export async function saveAvatarConfig(input: unknown): Promise<SaveAvatarConfigResult> {
//     const session = await auth.api.getSession({headers: await headers()});
//
//     // deflect unauthenticated callers safely without throwing critical runtime errors
//     if (!session?.user) {
//         return {
//             success: false,
//             error: "Not authenticated."
//         };
//     }
//
//     // Evaluates asset properties against type restrictions
//     const result = validateAvatarConfig(input);
//
//     if (!result.valid) {
//         return {success: false, error: result.error};
//     }
//
//     await db
//         .insert(avatar)
//         .values({userId: session.user.id, config: result.config})
//         .onConflictDoUpdate({
//             // Target Key constraint tracking unique singular relationships per row profile
//             target: avatar.userId,
//             set: {config: result.config},
//         });
//
//     return {success: true, config: result.config};
// }
//
// /**
//  * High-performance persistence fetch helper that isolates a single user's custom design configuration state.
//  * Safe for server components; skips permission evaluation loops to allow public dashboard profile hydration.
//  *
//  * @param {string} userId - The unique user identification primary key string matching targeted accounts.
//  *
//  * @returns {Promise<AvatarConfig | null>} A promise resolving to the saved configuration parameters, or null if
//  *                                         custom fields are missing.
//  */
// export async function getAvatarConfigForUser(userId: string): Promise<AvatarConfig | null> {
//     const row = await db.query.avatarConfig.findFirst({
//         where: (table) => eq(table.userId, userId), // ← Simplified with static import
//     });
//     return row?.config ?? null;
// }
