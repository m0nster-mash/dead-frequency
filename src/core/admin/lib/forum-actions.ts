"use server";

import {auth} from "@/core/auth";
import {forumBoard, forumCategory} from "@/feature/forum/schema/forum.schema";
import {db} from "@shared/db/client";
import {randomUUID} from "crypto";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {headers} from "next/headers";

/**
 * High-security middleware simulation checking active server-side session permissions.
 * Evaluates session configurations and denies pipeline access if the caller is not an administrator.
 *
 * @throws {Error} Throws an explicit `"Forbidden"` string error if authorization requirements fail
 *
 * @returns {Promise<void>} Resolves cleanly once permission gates are passed
 */
async function requireAdmin(): Promise<void> {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});
    if (!session?.user || session.user.role !== "admin") {
        throw new Error("Forbidden");
    }
}

/**
 * Strict data casting helper that normalizes form fields down to integers. Prevents system database failures caused
 * by malformed or non-numeric user inputs.
 *
 * @param {FormDataEntryValue | null} v - Raw value pulled out of the native form element context
 * @param {number} [fallback=0] - Numerical parameter value to return if the input parses as invalid
 *
 * @returns {number} The safely converted finite integer value or designated fallback value
 */
function parseIntStrict(v: FormDataEntryValue | null, fallback: number = 0): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

/**
 * Formats comma-separated text strings down to structured array maps containing cleaned key sequences.
 * Strips out blank entries or excess surrounding space characters safely.
 *
 * @param {string} raw - The raw comma-separated string sequence submitted from user interfaces
 *
 * @returns {string[]} An array list containing clean, non-empty text strings
 */
function csvIds(raw: string): string[] {
    return raw.split(",")
        .map((x) => x.trim())
        .filter(Boolean);
}

/**
 * Creates and inserts a new forum category record into the data layer.
 *
 * @param {FormData} formData - Payload carrying the new category label and sorting index variables
 *
 * @returns {Promise<void>} Resolves once records are appended and relevant cache paths are flushed
 */
export async function createForumCategoryAction(formData: FormData): Promise<void> {
    await requireAdmin();
    await db
        .insert(forumCategory).values({
            id: randomUUID(),
            label: String(formData.get("label") || "").trim(),
            sortOrder: parseIntStrict(formData.get("sortOrder"), 0),
        });
    // Invalidate cached view representations across matching route tracks
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

/**
 * Modifies an existing forum category configuration record.
 *
 * @param {FormData} formData - Payload carrying the targeted categoryId along with updated field parameters
 *
 * @returns {Promise<void>} Resolves once updates are committed and relevant caches are flushed
 */
export async function updateForumCategoryAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const categoryId = String(formData.get("categoryId"));
    await db
        .update(forumCategory)
        .set({
            label: String(formData.get("label") || "").trim(),
            sortOrder: parseIntStrict(formData.get("sortOrder"), 0),
        }).where(eq(forumCategory.id, categoryId));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

/**
 * Deletes a targeted forum category record from database storage.
 *
 * @param {FormData} formData - Payload carrying the categoryId selected for eradication
 *
 * @returns {Promise<void>} Resolves once records are deleted and layout caches are updated
 */
export async function deleteForumCategoryAction(formData: FormData): Promise<void> {
    await requireAdmin();
    await db
        .delete(forumCategory)
        .where(eq(forumCategory.id, String(formData.get("categoryId"))));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

/**
 * Sequentially updates the sequence weights of forum categories based on a list of clean string IDs.
 *
 * @param {FormData} formData - Payload containing the array list of ordered category identifiers
 *
 * @returns {Promise<void>} Resolves following multi-record transaction index changes
 */
export async function reorderForumCategoriesAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const ids = csvIds(String(formData.get("orderedCategoryIds") || ""));

    // Run sequential looping lookups updating sorting parameters match keys
    for (let i = 0; i < ids.length; i++) {
        await db
            .update(forumCategory)
            .set({sortOrder: i})
            .where(eq(forumCategory.id, ids[i]));
    }
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

/**
 * Appends a new discussion board record directly under a specific parent category container.
 *
 * @param {FormData} formData - Payload carrying parent category links, text descriptors, and parameters
 *
 * @returns {Promise<void>} Resolves following board insertion operations
 */
export async function createForumBoardAction(formData: FormData): Promise<void> {
    await requireAdmin();
    await db
        .insert(forumBoard).values({
            id: randomUUID(),
            categoryId: String(formData.get("categoryId")),
            label: String(formData.get("label") || "").trim(),
            description: String(formData.get("description") || "").trim() || null,
            sortOrder: parseIntStrict(formData.get("sortOrder"), 0),
        });
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

/**
 * Modifies configuration metadata fields belonging to an individual discussion board.
 *
 * @param {FormData} formData - Payload carrying board identity links and updated variables
 *
 * @returns {Promise<void>} Resolves once properties are updated and caches are flushed
 */
export async function updateForumBoardAction(formData: FormData): Promise<void> {
    await requireAdmin();
    await db
        .update(forumBoard)
        .set({
            categoryId: String(formData.get("categoryId")),
            label: String(formData.get("label") || "").trim(),
            description: String(formData.get("description") || "").trim() || null,
            sortOrder: parseIntStrict(formData.get("sortOrder"), 0),
        })
        .where(eq(forumBoard.id, String(formData.get("boardId"))));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

/**
 * Permanently removes an individual discussion board record from data storage
 *
 * @param {FormData} formData - Payload targeting the specific boardId marked for deletion
 *
 * @returns {Promise<void>} Resolves once removal pipelines execute
 */
export async function deleteForumBoardAction(formData: FormData): Promise<void> {
    await requireAdmin();
    await db
        .delete(forumBoard)
        .where(eq(forumBoard.id, String(formData.get("boardId"))));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

/**
 * Reassigns a discussion board to a completely different parent category structural tree.
 *
 * @param {FormData} formData - Payload capturing target category transitions
 *
 * @returns {Promise<void>} Resolves upon connection switch completions
 */
export async function moveForumBoardAction(formData: FormData): Promise<void> {
    await requireAdmin();
    await db
        .update(forumBoard)
        .set({categoryId: String(formData.get("targetCategoryId"))})
        .where(eq(forumBoard.id, String(formData.get("boardId"))));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

/**
 * Safety-checked re-indexing block that recalculates display sequences for boards nested in a category.
 * Cross-checks provided indices against active database items to shield data integrity from foreign input injections.
 *
 * @param {FormData} formData - Payload carrying the list context array containing child board order targets
 *
 * @returns {Promise<void>} Resolves once localized indexing constraints pass changes
 */
export async function reorderForumBoardsAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const categoryId = String(formData.get("categoryId"));
    const ids = csvIds(String(formData.get("orderedBoardIds") || ""));

    // Query Guard: Pull verified records currently residing within the category context to act as standard boundaries
    const boardsInCategory =
        await db
            .select({id: forumBoard.id})
            .from(forumBoard)
            .where(eq(forumBoard.categoryId, categoryId));

    const validIds = new Set(boardsInCategory.map((b) => b.id));

    // Intersection verification filtering foreign parameters out of execution blocks
    const filtered = ids.filter((id) => validIds.has(id));

    for (let i = 0; i < filtered.length; i++) {
        await db
            .update(forumBoard)
            .set({sortOrder: i})
            .where(eq(forumBoard.id, filtered[i]));
    }

    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

/**
 * Soft-detaches a discussion board from its primary category, moving it into an administrative fallback grouping.
 * Automatically provisions an "Uncategorized" container if no fallback target row entry is set up.
 *
 * @param {FormData} formData - Payload mapping the boardId marked for isolation
 *
 * @returns {Promise<void>} Resolves following structural fallback migrations
 */
export async function removeBoardFromCategoryAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const boardId = String(formData.get("boardId"));

    // Check for existing administrative isolation containers
    const uncategorized =
        await db
            .select()
            .from(forumCategory)
            .where(eq(forumCategory.label, "Uncategorized"))
            .limit(1);
    let uncategorizedId = uncategorized[0]?.id;

    // Fallback Generator Guard: Auto-creates a baseline isolation structure if missing from data layers
    if (!uncategorizedId) {
        uncategorizedId = randomUUID();
        await db
            .insert(forumCategory).values({
                id: uncategorizedId,
                label: "Uncategorized",
                sortOrder: 9999, // Places the fallback node underneath normal operations
            });
    }
    // Remaps the target board to structural fallback buckets
    await db
        .update(forumBoard)
        .set({categoryId: uncategorizedId})
        .where(eq(forumBoard.id, boardId));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}
