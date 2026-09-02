import sanitizeHtml from "sanitize-html";

// Load this from DB/config later (word filter admin tool). Static list
// is a fine placeholder for now.
const BLOCKED_WORDS: string[] = [];

export type SanitizeResult = {
    clean: string;
    flagged: boolean;
    matchedWords: string[];
};

/**
 * Every module MUST call this before persisting user-generated content
 * (forum posts, chatbox/chatroom messages, DMs, comments, blog posts).
 * Do not hand-roll per-module escaping — that's how one module gets an
 * XSS fix and the others don't.
 */
export function sanitizeContent(raw: string): SanitizeResult {
    const clean = sanitizeHtml(raw, {
        allowedTags: [], // start with zero HTML allowed; loosen deliberately per-module later
        allowedAttributes: {},
    }).trim();

    const lower = clean.toLowerCase();
    const matchedWords = BLOCKED_WORDS.filter((word) => lower.includes(word));

    return {
        clean,
        flagged: matchedWords.length > 0,
        matchedWords,
    };
}