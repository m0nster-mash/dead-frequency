"use server";

import {randomUUID} from "crypto";
import {headers} from "next/headers";
import {eq, inArray} from "drizzle-orm";
import {auth} from "@/core/auth";
import {db} from "@shared/db/client";
import {forumBoard, forumCategory} from "@/feature/forum/schema/forum.schema";
import {revalidatePath} from "next/cache";

async function requireAdmin() {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({headers: requestHeaders});
    if (!session?.user || session.user.role !== "admin") throw new Error("Forbidden");
}

function parseIntStrict(v: FormDataEntryValue | null, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

function csvIds(raw: string) {
    return raw.split(",").map((x) => x.trim()).filter(Boolean);
}

export async function createForumCategoryAction(formData: FormData) {
    await requireAdmin();
    await db.insert(forumCategory).values({
        id: randomUUID(),
        label: String(formData.get("label") || "").trim(),
        sortOrder: parseIntStrict(formData.get("sortOrder"), 0),
    });
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

export async function updateForumCategoryAction(formData: FormData) {
    await requireAdmin();
    const categoryId = String(formData.get("categoryId"));
    await db.update(forumCategory).set({
        label: String(formData.get("label") || "").trim(),
        sortOrder: parseIntStrict(formData.get("sortOrder"), 0),
    }).where(eq(forumCategory.id, categoryId));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

export async function deleteForumCategoryAction(formData: FormData) {
    await requireAdmin();
    await db.delete(forumCategory).where(eq(forumCategory.id, String(formData.get("categoryId"))));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

export async function reorderForumCategoriesAction(formData: FormData) {
    await requireAdmin();
    const ids = csvIds(String(formData.get("orderedCategoryIds") || ""));
    for (let i = 0; i < ids.length; i++) {
        await db.update(forumCategory).set({sortOrder: i}).where(eq(forumCategory.id, ids[i]));
    }
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

export async function createForumBoardAction(formData: FormData) {
    await requireAdmin();
    await db.insert(forumBoard).values({
        id: randomUUID(),
        categoryId: String(formData.get("categoryId")),
        label: String(formData.get("label") || "").trim(),
        description: String(formData.get("description") || "").trim() || null,
        sortOrder: parseIntStrict(formData.get("sortOrder"), 0),
    });
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

export async function updateForumBoardAction(formData: FormData) {
    await requireAdmin();
    await db.update(forumBoard).set({
        categoryId: String(formData.get("categoryId")),
        label: String(formData.get("label") || "").trim(),
        description: String(formData.get("description") || "").trim() || null,
        sortOrder: parseIntStrict(formData.get("sortOrder"), 0),
    }).where(eq(forumBoard.id, String(formData.get("boardId"))));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

export async function deleteForumBoardAction(formData: FormData) {
    await requireAdmin();
    await db.delete(forumBoard).where(eq(forumBoard.id, String(formData.get("boardId"))));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

export async function moveForumBoardAction(formData: FormData) {
    await requireAdmin();
    await db.update(forumBoard).set({
        categoryId: String(formData.get("targetCategoryId")),
    }).where(eq(forumBoard.id, String(formData.get("boardId"))));
    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

export async function reorderForumBoardsAction(formData: FormData) {
    await requireAdmin();
    const categoryId = String(formData.get("categoryId"));
    const ids = csvIds(String(formData.get("orderedBoardIds") || ""));

    const boardsInCategory = await db.select({id: forumBoard.id})
        .from(forumBoard)
        .where(eq(forumBoard.categoryId, categoryId));

    const validIds = new Set(boardsInCategory.map((b) => b.id));
    const filtered = ids.filter((id) => validIds.has(id));

    for (let i = 0; i < filtered.length; i++) {
        await db.update(forumBoard).set({sortOrder: i}).where(eq(forumBoard.id, filtered[i]));
    }

    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}

export async function removeBoardFromCategoryAction(formData: FormData) {
    await requireAdmin();
    const boardId = String(formData.get("boardId"));

    const uncategorized = await db.select().from(forumCategory).where(eq(forumCategory.label, "Uncategorized")).limit(1);
    let uncategorizedId = uncategorized[0]?.id;

    if (!uncategorizedId) {
        uncategorizedId = randomUUID();
        await db.insert(forumCategory).values({
            id: uncategorizedId,
            label: "Uncategorized",
            sortOrder: 9999,
        });
    }

    await db.update(forumBoard)
        .set({categoryId: uncategorizedId})
        .where(eq(forumBoard.id, boardId));

    revalidatePath("/admin/forum");
    revalidatePath("/forum");
}
