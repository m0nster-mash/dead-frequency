"use server";

import {db} from "@/shared/db/client";
import {eq, sql} from "drizzle-orm";
import {userTrust} from "../schema/status.schema";

/**
 * Static dictionary defining post count thresholds required to trigger automated account tier advancements.
 */
const PROMOTION_THRESHOLDS = {
    basic: 5,
    trusted: 50,
    veteran: 250,
} as const;

/**
 * Anti-spam strategy: rate-limiting interval delays enforced between submission events.
 */
const COOLDOWN_MS = {
    new: 60_000,   // Mandatory 1 post per minute cooling curve for unverified newcomers
    basic: 15_000,  // Reduced 15-second delay tracking window for promoted active members
} as const;

/**
 * Evaluates a user account's engagement history and rate-limiting cooldown boundaries to allow or block content
 * submission. This cheap low-overhead anti-spam barrier should be called immediately before parsing request payloads.
 *
 * Technical verification flow:
 * 1. Checks the `userTrust` table matching targeted user identities.
 * 2. Unregistered Fallback: Permits passage if the profile has zero recorded entries, deferring initialization to
 *    creation steps.
 * 3. Restriction Check: Drops execution immediately if accounts carry a hard `"restricted"` type standing signature.
 * 4. Cooldown Validation: Measures current server times against preserved windows to block rapid multi-click
 *    submissions.
 *
 * @param {string} userId - The unique user identification primary key string matching the active submission author.
 * @returns {Promise<{ allowed: boolean; reason?: string }>} An operation result dictionary confirming access
 *                                                           permissions.
 */
export async function canPost(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    const [row] = await db
        .select()
        .from(userTrust)
        .where(eq(userTrust.userId, userId))
        .limit(1);

    // Permits first-time posts cleanly, offloading initialization metrics to downstream recording methods
    if (!row) return {allowed: true};

    // Denies pipeline access if system integrity workflows have quarantined the account
    if (row.trustLevel === "restricted") {
        return {allowed: false, reason: "Account posting privileges are restricted."};
    }

    /**
     * Rate-Limiting cooldown evaluation compares the active high-precision machine clock against stored cooldown
     * timers to throttle rapid automated spambots or scripts.
     */
    if (row.cooldownUntil && row.cooldownUntil > new Date()) {
        return {allowed: false, reason: "You're posting too quickly. Please wait a moment."};
    }

    return {allowed: true};
}

/**
 * Logs a successful submission event, updates rate-limiting parameters, and runs rank check criteria. Enforces an
 * upsert model ensuring data structure presence on first execution loops.
 *
 * @param {string} userId - The unique identification primary key of the author who committed a content post.
 * @returns {Promise<void>} A promise resolving once structural updates are committed and rank re-evaluations pass.
 */
export async function recordPost(userId: string): Promise<void> {
    const cooldownMs = COOLDOWN_MS.new; // Operational Note: can refine per-level dynamically after parsing active row signatures

    // Increments interaction weights using clean PostgreSQL update macros via Drizzle ORM
    await db
        .insert(userTrust)
        .values({
            userId,
            postCount: 1,
            cooldownUntil: new Date(Date.now() + cooldownMs),
        })
        .onConflictDoUpdate({
            // checks the primary tracking constraint
            target: userTrust.userId,
            set: {
                // Uses inline atomic queries to safeguard tracking integers from cross-thread race conditions
                postCount: sql`${userTrust.postCount}
                + 1`,
                cooldownUntil: new Date(Date.now() + cooldownMs),
                updatedAt: new Date(),
            },
        });

    // recalculates platform trust rankings post-insertion
    await recalculateTrustLevel(userId);
}

/**
 * Programmatically tracks engagement numbers against promotion bounds to upgrade tier access clearance tokens.
 * Short-circuits execution if users hold a hard restricted status tag.
 *
 * @param {string} userId - Target account reference being assessed for level advancements.
 * @returns {Promise<void>} A promise resolving once calculation conditions commit changes.
 */
async function recalculateTrustLevel(userId: string): Promise<void> {
    const [row] = await db.select().from(userTrust).where(eq(userTrust.userId, userId)).limit(1);

    // Lock classification updates if records are blank or systematically restricted
    if (!row || row.trustLevel === "restricted") return;

    // Evaluates ranking tiers chronologically by matching step milestones
    const level =
        row.postCount >= PROMOTION_THRESHOLDS.veteran ? "veteran" :
            row.postCount >= PROMOTION_THRESHOLDS.trusted ? "trusted" :
                row.postCount >= PROMOTION_THRESHOLDS.basic ? "basic" : "new";

    // Dispatches mutation query loops if target ranks differ from old stored parameters
    if (level !== row.trustLevel) {
        await db.update(userTrust).set({trustLevel: level}).where(eq(userTrust.userId, userId));
    }
}

/**TODO:: implement feature or delete function
 *
 * Registers incoming report notifications, bans, or blocks to adjust localized account reputation scores.
 * Enforces an automated security ceiling, auto-quarantining users if negative logs cross boundary limits.
 *
 * @param {string} userId - The target user profile receiving compliance alerts or flags.
 * @returns {Promise<void>} A promise resolving once data changes persist and quarantine limits are calculated.
 */
export async function recordNegativeSignal(userId: string): Promise<void> {
    // Registers incoming flag indicators safely inside row fields
    await db
        .insert(userTrust)
        .values({userId, negativeSignalCount: 1})
        .onConflictDoUpdate({
            target: userTrust.userId,
            set: {
                negativeSignalCount: sql`${userTrust.negativeSignalCount}
                + 1`
            },
        });

    const [row] = await db.select().from(userTrust).where(eq(userTrust.userId, userId)).limit(1);

    /**
     * Flags and demotes accounts automatically to an immutable "restricted" state if cumulative user-driven negative
     * feedback markers scale to 10 or greater.
     */
    if (row && row.negativeSignalCount >= 10 && row.trustLevel !== "restricted") {
        await db.update(userTrust).set({trustLevel: "restricted"}).where(eq(userTrust.userId, userId));
    }
}
