// This isn't a file to add as-is — it's the pattern to copy into the
// forum/chatbox schemas when you build Task 4/5. Shown here so Task 1
// documents the convention before those modules exist.
//
//   export const forumBoard = pgTable("forum_board", {
//     id: text("id").primaryKey(),
//     categoryId: text("category_id").notNull(),
//     name: text("name").notNull(),
//     // null = site-wide board, non-null = belongs to a guild.
//     // No FK yet since the guild table doesn't exist — add the reference
//     // once Guild System schema lands, same approach as characterId.
//     contextId: text("context_id"),
//   });
export {};
