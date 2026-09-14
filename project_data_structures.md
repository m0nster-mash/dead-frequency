# Dead Frequency: Schema & Requirements Specification

This document maps out and expands on all system items defined in `scratch_table_structure.md`, formatted according to
the required specification template.

---

### Users

#### Overview

* Primary user account entity representing site identity, authentication, permissions, account standing, and asset
  ownership.

#### Expanded details

* **Trust-Level Mechanic**: New accounts operate under a lightweight trust standing (e.g., Level 0) with posting limits
  (cooldowns, rate limits, link restrictions) until they reach *N* verified posts, serving as an initial anti-spam
  defense.
* **Account Standing**: Unified tracking for account states including active/good standing, muted, timed out,
  shadowbanned, or banned.
* **Economy Integration**: Points balance accrued through site activity and spent on avatar items, guild upgrades, or
  customization.
* **Soft Deletion**: Account deactivation and soft deletion preserving data integrity across authored content where
  applicable.

#### Table Details

* **Table Name**: `users`
* **Primary Key**: `id` (uuid / string)
* **Columns**:
    * `id`: `uuid` (PK)
    * `email`: `varchar(255)` (UNIQUE, NOT NULL)
    * `hashed_password`: `text` (nullable if OAuth)
    * `role_id`: `varchar(64)` (FK -> `roles.id`, NOT NULL)
    * `account_status`: `varchar(32)` (DEFAULT 'ACTIVE') — e.g. 'ACTIVE', 'MUTED', 'TIMED_OUT', 'BANNED'
    * `trust_level`: `integer` (DEFAULT 0, NOT NULL)
    * `post_count`: `integer` (DEFAULT 0, NOT NULL)
    * `points_balance`: `integer` (DEFAULT 0, NOT NULL)
    * `created_at`: `timestamp` (DEFAULT now ())
    * `updated_at`: `timestamp` (DEFAULT now ())
    * `deleted_at`: `timestamp` (nullable)
* **Relationships**:
    * Belongs to `roles` (1:N)
    * Has one `user_profiles` (1:1)
    * Has one `avatars` (1:1)
    * Has one `blogs` (1:1)
    * Has many `characters` (1:N)
    * Has many `user_friendships` (1:N)
    * Has many `character_favorites` (1:N)

#### Behavioural Details

* A user can own and manage multiple characters, with all owned characters linked on their public profile page.
* A user can post in forums, chatboxes, blogs, and comments as long as their permissions and trust-level limits allow.
* Users can edit or soft-delete their own authored posts and delete their owned characters.
* Users can friend other users, DM other users, and favorite other users' characters.
* Points are automatically awarded upon valid post creation and deducted for purchases.

#### Unknowns

* Exact post count threshold *N* required for automatic trust-level promotion.
* Social OAuth login integrations with BetterAuth.

---

### Characters

#### Overview

* Roleplay persona entities created and owned by a primary user account, featuring an isolated identity, profile,
  journal, and avatar.

#### Expanded details

* **First-Class Authorship**: `character_id` is supported as an optional first-class field alongside `user_id` across
  all allowed communication tables (`author_type` + `author_id` polymorphic pattern or dual nullable keys).
* **Module-Level Toggling**: Every communication context (forum board, chatbox instance, chatroom) supports an
  `allows_character_posting: boolean` configuration toggle.
* **Visual Distinction**: Character posts render with distinct visual styling (custom borders, character avatar,
  character name plate) compared to core user posts.

#### Table Details

* **Table Name**: `characters`
* **Primary Key**: `id` (uuid / string)
* **Columns**:
    * `id`: `uuid` (PK)
    * `owner_user_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `name`: `varchar(255)` (NOT NULL)
    * `slug`: `varchar(255)` (NOT NULL)
    * `created_at`: `timestamp` (DEFAULT now ())
    * `updated_at`: `timestamp` (DEFAULT now ())
    * `deleted_at`: `timestamp` (nullable)
* **Relationships**:
    * Belongs to `users` (N:1)
    * Has one `character_profiles` (1:1)
    * Has one `avatars` (1:1)
    * Has one `blogs` (1:1, as Character Journal)
    * Has many `character_friendships` (1:N)
    * Has many `character_favorites` (1:N, as target)

#### Behavioural Details

* Owned by a single user account; deleting a character soft-deletes its profile and journal.
* Character profile explicitly links back to the owning user's profile and lists sibling characters.
* Can post in allowed blogs, forums, and chatboxes, and edit/soft-delete own posts.
* Can friend other characters (bidirectional) and be favorited by other users (unidirectional).

#### Unknowns

* Maximum allowed character creation limit per user account.
* Whether characters can join guilds independently of their owning user.

---

### Guilds

#### Overview

* User-created sub-communities featuring user rosters, application approvals, custom themes, a dedicated forum
  category, and scoped chatboxes (similar to Neopets guilds).

#### Expanded details

* **Scoped Context Architecture**: Scoped features (forum, chatbox, user list) utilize a nullable `context_id`
  (`null` = site-wide, `guild_id` = guild-scoped) to prevent refactoring when instantiating per-guild modules.
* **Ranks & Governance**: Multi-tiered membership hierarchy ('owner', 'moderator', 'user', 'banned', 'pending').
* **Applications**: Join requests require manual approval by a guild owner or moderator.

#### Table Details

* **Table Name**: `guilds` & `guild_members`
* **Columns (`guilds`)**:
    * `id`: `uuid` (PK)
    * `owner_user_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `name`: `varchar(255)` (NOT NULL)
    * `description`: `text`
    * `theme_config`: `jsonb` (custom colors, header layout)
    * `created_at`: `timestamp` (DEFAULT now ())
* **Columns (`guild_members`)**:
    * `id`: `uuid` (PK)
    * `guild_id`: `uuid` (FK -> `guilds.id`, NOT NULL)
    * `actor_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `actor_id`: `uuid` (NOT NULL)
    * `rank`: `varchar(32)` (DEFAULT 'MEMBER') — 'OWNER', 'MODERATOR', 'MEMBER', 'BANNED'
    * `status`: `varchar(32)` (DEFAULT 'PENDING') — 'PENDING', 'APPROVED', 'REJECTED'
    * `joined_at`: `timestamp` (DEFAULT now ())
* **Relationships**:
    * Belongs to `users` (owner)
    * Has many `guild_members`
    * Has one `forum_categories` (scoped via `context_id`)
    * Has one `chatbox_instances` (scoped via `context_id`)

#### Behavioural Details

* Users can create and join multiple guilds.
* Guild mods can approve applications, delete guild posts, kick/ban members, and adjust guild board settings.
* Includes a custom homepage layout and member list.

#### Unknowns

* Whether guild ownership can be assigned to a Character entity instead of a User.
* Fine-grained custom rank permission flags beyond standard ranks.

---

### Blogs / Journals

#### Overview

* Personal blog system supporting User Blogs, Character Journals, and Official Admin News Blogs with comment sections
  and subscriptions.

#### Expanded details

* **Unified Engine**: Official site news and admin updates run on the same blog engine with an `is_official` flag,
  avoiding dual codebases.
* **Publishing Controls**: Supports `draft` vs `published` status and visibility settings (`public`, `subscribers_only`,
  `private`).
* **Generic Follows**: Uses a generic `subscriptions` table `(subscriber_id, target_module, target_record_id)` for blog
  subscriptions.

#### Table Details

* **Table Name**: `blogs` & `blog_posts`
* **Columns (`blogs`)**:
    * `id`: `uuid` (PK)
    * `owner_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `owner_id`: `uuid` (NOT NULL, UNIQUE per owner)
    * `title`: `varchar(255)` (NOT NULL)
    * `description`: `text`
    * `is_official`: `boolean` (DEFAULT false)
    * `created_at`: `timestamp` (DEFAULT now ())
* **Columns (`blog_posts`)**:
    * `id`: `uuid` (PK)
    * `blog_id`: `uuid` (FK -> `blogs.id`, NOT NULL)
    * `title`: `varchar(255)` (NOT NULL)
    * `slug`: `varchar(255)` (NOT NULL)
    * `content`: `text` (NOT NULL)
    * `status`: `varchar(32)` (DEFAULT 'PUBLISHED') — 'DRAFT', 'PUBLISHED'
    * `visibility`: `varchar(32)` (DEFAULT 'PUBLIC') — 'PUBLIC', 'SUBSCRIBERS_ONLY', 'PRIVATE'
    * `created_at`: `timestamp` (DEFAULT now ())
    * `updated_at`: `timestamp` (DEFAULT now ())
* **Relationships**:
    * Belongs to User or Character (1:1)
    * Has many `blog_posts` (1:N)
    * Posts have many `comments` (via polymorphic target)

#### Behavioural Details

* Embedded on user/character profile pages and accessible via dedicated blog routes.
* Users/characters can subscribe to blogs to receive notification alerts upon new post publication.
* Comments on blog posts feed directly into the central notification engine.

#### Unknowns

* Permalink route structure for standalone shared posts versus profile-embedded views.

---

### Direct Messages

#### Overview

* Private 1-on-1 messaging system featuring message archiving, custom folders, tags, block enforcement, and moderator
  audit trails.

#### Expanded details

* **Moderator Audit Trail**: Access by admins/mods to private DMs generates an immutable audit log entry logging who
  viewed which DM and when, protecting both users and staff.
* **Organization**: Support for custom conversation folders, tagging, archiving, and closing conversations.
* **Safety**: Integrated rate limiting against mass-messaging harassment and automatic block/ignore enforcement.

#### Table Details

* **Table Name**: `dm_conversations`, `dm_messages`, `dm_participant_settings`
* **Columns (`dm_conversations`)**:
    * `id`: `uuid` (PK)
    * `participant_a_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `participant_b_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `created_at`: `timestamp` (DEFAULT now ())
    * `updated_at`: `timestamp` (DEFAULT now ())
* **Columns (`dm_messages`)**:
    * `id`: `uuid` (PK)
    * `conversation_id`: `uuid` (FK -> `dm_conversations.id`, NOT NULL)
    * `sender_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `content`: `text` (NOT NULL)
    * `read_at`: `timestamp` (nullable)
    * `created_at`: `timestamp` (DEFAULT now ())
    * `deleted_at`: `timestamp` (nullable)
* **Columns (`dm_participant_settings`)**:
    * `conversation_id`: `uuid` (FK)
    * `user_id`: `uuid` (FK)
    * `is_archived`: `boolean` (DEFAULT false)
    * `is_closed`: `boolean` (DEFAULT false)
    * `folder_name`: `varchar(64)` (DEFAULT 'inbox')
    * `tags`: `text[]`

#### Behavioural Details

* Private 1x1 messaging between users.
* Users can close, archive, tag, or delete conversations from their inbox view.
* Unread badges notify users of new messages. Blocked users cannot initiate DMs.

#### Unknowns

* Whether DM functionality should be extended to allow Character-to-Character private messages.

---

### Forums

#### Overview

* Structured discussion system (Category -> Board -> Thread -> Post) featuring flat replies, @mentions, post history,
  and chatbox mirror views.

#### Expanded details

* **Flat Reply System with References**: Posts are flat for performance and readability, featuring lightweight `@user` /
  `reply_to_post_id` references.
* **Chatbox/Chatroom Mirror Sub-Forums**: Dedicated read-only sub-forums displaying chatbox/chatroom history read
  directly from underlying message tables as a view, eliminating data duplication.
* **Post Tracking**: User post counts are indexed and displayed on profiles and author sidebars.

#### Table Details

* **Table Name**: `forum_categories`, `forum_boards`, `forum_threads`, `forum_posts`
* **Columns (`forum_categories`)**:
    * `id`: `uuid` (PK)
    * `context_id`: `uuid` (nullable FK -> `guilds.id`)
    * `name`: `varchar(255)` (NOT NULL)
    * `order_index`: `integer` (DEFAULT 0)
* **Columns (`forum_boards`)**:
    * `id`: `uuid` (PK)
    * `category_id`: `uuid` (FK -> `forum_categories.id`, NOT NULL)
    * `name`: `varchar(255)` (NOT NULL)
    * `description`: `text`
    * `allows_character_posting`: `boolean` (DEFAULT true)
    * `order_index`: `integer` (DEFAULT 0)
* **Columns (`forum_threads`)**:
    * `id`: `uuid` (PK)
    * `board_id`: `uuid` (FK -> `forum_boards.id`, NOT NULL)
    * `title`: `varchar(255)` (NOT NULL)
    * `is_pinned`: `boolean` (DEFAULT false)
    * `is_locked`: `boolean` (DEFAULT false)
    * `created_at`: `timestamp` (DEFAULT now ())
* **Columns (`forum_posts`)**:
    * `id`: `uuid` (PK)
    * `thread_id`: `uuid` (FK -> `forum_threads.id`, NOT NULL)
    * `author_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `author_id`: `uuid` (NOT NULL)
    * `content`: `text` (NOT NULL)
    * `reply_to_post_id`: `uuid` (nullable FK -> `forum_posts.id`)
    * `created_at`: `timestamp` (DEFAULT now ())
    * `updated_at`: `timestamp` (DEFAULT now ())
    * `deleted_at`: `timestamp` (nullable)

#### Behavioural Details

* Hierarchical board navigation with flat thread replies.
* Users and characters (if board allows) can post, edit, and soft-delete their posts.
* `@mentions` trigger real-time notification alerts.
* User post history and counts are tracked on profile views.

#### Unknowns

* Search strategy: Native Postgres full-text search (`tsvector`) vs external search engine (Meilisearch / Typesense).

---

### Profiles

#### Overview

* Public showcase pages for Users and Characters displaying bios, avatars, activity feeds, owned characters, and profile
  comment walls.

#### Expanded details

* **Aggregated Activity Feed**: Displays a timeline of recent activity (blog posts, forum threads, character creations,
  reactions) for the user and their characters.
* **Profile Comments**: Reusable comment engine attached to user and character profile targets.

#### Table Details

* **Table Name**: `user_profiles` & `character_profiles`
* **Columns (`user_profiles`)**:
    * `id`: `uuid` (PK)
    * `user_id`: `uuid` (FK -> `users.id`, UNIQUE, NOT NULL)
    * `bio`: `text`
    * `header_banner_url`: `text`
    * `theme_settings`: `jsonb`
* **Columns (`character_profiles`)**:
    * `id`: `uuid` (PK)
    * `character_id`: `uuid` (FK -> `characters.id`, UNIQUE, NOT NULL)
    * `owner_user_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `bio`: `text`
    * `header_banner_url`: `text`

#### Behavioural Details

* User profile lists all owned characters with direct links.
* Character profile links directly back to the owner's core user profile.
* Includes activity feeds and profile comment walls.

#### Unknowns

* Custom CSS/HTML design override limits for user profile pages.

---

### Avatars

#### Overview

* Visual representation engine for Users and Characters featuring modular SVG asset layer customization.

#### Expanded details

* **Layered Composition**: Dynamic SVG composition engine combining base, eyes, hair, and mouth layers.
* **Shop & Economy**: Unlocking asset layers via site points balance.

#### Table Details

* **Table Name**: `avatars`
* **Columns**:
    * `id`: `uuid` (PK)
    * `owner_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `owner_id`: `uuid` (NOT NULL, UNIQUE per owner)
    * `layer_config`: `jsonb` (NOT NULL) — e.g.
      `{"base": "base_1", "eyes": "eyes_2", "hair": "hair_1", "mouth": "mouth_1"}`
    * `raster_url`: `text` (optional cached PNG/SVG rendering)
    * `updated_at`: `timestamp` (DEFAULT now ())

#### Behavioural Details

* Users and Characters each have 1 avatar, editable at any time.
* Avatars render next to posts, chat messages, profiles, and dropdowns.

#### Unknowns

* Asset layer inventory management table structure for purchased avatar items.

---

### Notifications

#### Overview

* Connective notification hub delivering alerts for @pings, DMs, reactions, friend requests, subscriptions, and
  moderation events.

#### Expanded details

* **Placement**: `<NotificationPanel />` component rendered in site header dropdown and dedicated notifications page.
* **Unread Indicators**: Badge counter and red dot indicator on header icon.
* **Smart Navigation**: Redirects user to exact content source or standalone notification page if no direct page URL
  exists.

#### Table Details

* **Table Name**: `notifications`
* **Columns**:
    * `id`: `uuid` (PK)
    * `recipient_user_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `event_type`: `varchar(64)` (NOT NULL) — 'PING', 'DM', 'REACTION', 'FRIEND_REQUEST', 'BLOG_POST', 'MOD_ALERT'
    * `actor_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `actor_id`: `uuid` (NOT NULL)
    * `target_module`: `varchar(32)` (NOT NULL)
    * `target_record_id`: `uuid` (NOT NULL)
    * `payload`: `jsonb` (stores preview text, link path)
    * `read_at`: `timestamp` (nullable)
    * `created_at`: `timestamp` (DEFAULT now ())

#### Behavioural Details

* Automatically generated upon triggers across all modules.
* Clicking an item marks it read and navigates to target.

#### Unknowns

* Real-time transport implementation choice (WebSockets via custom server vs Pusher / Supabase Realtime).

---

### Reactions

#### Overview

* Generic emoji interaction sub-system attachable to posts, blog entries, and comments.

#### Expanded details

* **Polymorphic Architecture**: Reusable `(target_module, target_record_id)` schema serving forums, blogs, comments, and
  chatboxes.

#### Table Details

* **Table Name**: `reactions`
* **Columns**:
    * `id`: `uuid` (PK)
    * `target_module`: `varchar(32)` (NOT NULL)
    * `target_record_id`: `uuid` (NOT NULL)
    * `actor_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `actor_id`: `uuid` (NOT NULL)
    * `emoji_type`: `varchar(32)` (NOT NULL)
    * `created_at`: `timestamp` (DEFAULT now ())

#### Behavioural Details

* Allows users/characters to react to any supported content item.
* Prevents duplicate reactions per actor and emoji type on a given target.

#### Unknowns

* Restricting to a fixed set of emojis versus open Unicode emoji picker.

---

### Friends / Favourites / Blocks

#### Overview

* Social relationship engine managing peer friendships, character favoriting, and cross-module block enforcement.

#### Expanded details

* **Shared Enforcement**: `canInteract(actorA, actorB)` service in shared layer enforcing blocks across DMs, mentions,
  comments, and forum replies.
* **Audit Logging**: All block/unblock actions generate audit log entries.
* **Trust Integration**: Frequently blocked users trigger flags in the account standing/trust system.

#### Table Details

* **Table Name**: `user_friendships`, `character_friendships`, `character_favorites`, `blocks`
* **Columns (`user_friendships`)**:
    * `id`: `uuid` (PK)
    * `requester_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `addressee_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `status`: `varchar(32)` (DEFAULT 'PENDING') — 'PENDING', 'ACCEPTED'
* **Columns (`blocks`)**:
    * `id`: `uuid` (PK)
    * `blocker_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `blocker_id`: `uuid` (NOT NULL)
    * `blocked_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `blocked_id`: `uuid` (NOT NULL)
    * `created_at`: `timestamp` (DEFAULT now ())

#### Behavioural Details

* User friendships are mutual (User-to-User).
* Character friendships are mutual (Character-to-Character).
* Character favorites are unidirectional (User-to-Character).
* Blocks prevent DMs, mentions, comments, and interactions.

#### Unknowns

* Visual representation of blocked users in public threads (total collapse vs placeholder).

---

### Moderation (/admin) Tools

#### Overview

* Unified administrative engine providing reports queues, audit logs, word filtering, input sanitization, and user
  sanctions.

#### Expanded details

* **Unified Reports Queue**: Polymorphic `reports` table capturing user reports from any module.
* **Word Filter & Sanitization**: Automated filter preventing toxic slurs, script injection (XSS), and destructive
  markup.
* **Comprehensive Audit Trail**: Records mod actions (bans, mutes, soft deletes, DM inspections).

#### Table Details

* **Table Name**: `reports`, `audit_logs`, `word_filters`
* **Columns (`reports`)**:
    * `id`: `uuid` (PK)
    * `target_module`: `varchar(32)` (NOT NULL)
    * `target_record_id`: `uuid` (NOT NULL)
    * `reporter_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `reason`: `text` (NOT NULL)
    * `status`: `varchar(32)` (DEFAULT 'PENDING') — 'PENDING', 'RESOLVED', 'DISMISSED'
    * `resolved_by`: `uuid` (nullable FK -> `users.id`)
    * `created_at`: `timestamp` (DEFAULT now ())
* **Columns (`audit_logs`)**:
    * `id`: `uuid` (PK)
    * `actor_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `action_type`: `varchar(64)` (NOT NULL)
    * `target_module`: `varchar(32)`
    * `target_record_id`: `uuid`
    * `metadata`: `jsonb`
    * `created_at`: `timestamp` (DEFAULT now ())

#### Behavioural Details

* Mods can view/resolve report queues, view audit logs, soft-delete messages, and apply mutes/shadowbans/bans.
* All mod actions write immutable audit log records.

#### Unknowns

* Formal user ban appeal submission and review workflow table schema.

---

### Chatbox

#### Overview

* Portable, collapsible real-time chat widget embeddable on any page or scoped to specific contexts (e.g., guilds).

#### Expanded details

* **Scoped Context**: Supports site-wide (`context_id = null`) or guild-scoped (`context_id = guild_id`) instances.
* **Visual Distinction**: Renders distinct styling for User, Character, and Mod posts.
* **Forum Mirror**: Displayed on a dedicated sub-forum view.

#### Table Details

* **Table Name**: `chatbox_messages`
* **Columns**:
    * `id`: `uuid` (PK)
    * `context_id`: `uuid` (nullable FK -> `guilds.id`)
    * `author_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `author_id`: `uuid` (NOT NULL)
    * `is_mod_post`: `boolean` (DEFAULT false)
    * `message`: `text` (NOT NULL)
    * `created_at`: `timestamp` (DEFAULT now ())
    * `updated_at`: `timestamp` (DEFAULT now ())
    * `deleted_at`: `timestamp` (nullable)

#### Behavioural Details

* Expandable/collapsible floating or embedded widget.
* Authors can edit and soft-delete own messages. Mods can pin, edit, delete, and mute.

#### Unknowns

* Message retention/pruning strategy (e.g., prune messages older than 30 days vs infinite log).

---

### Chatroom

#### Overview

* Dedicated multi-room persistent chat application featuring channel/topic partitioning and participant lists.

#### Expanded details

* **Multi-Room Support**: Multiple channels/rooms from day one.
* **Forum Mirror**: Mirrored in dedicated forum sub-view.
* **Real-time Delivery**: WebSocket transport for instant messaging and presence indicators.

#### Table Details

* **Table Name**: `chatrooms`, `chatroom_messages`
* **Columns (`chatrooms`)**:
    * `id`: `uuid` (PK)
    * `name`: `varchar(255)` (NOT NULL)
    * `topic`: `text`
    * `is_private`: `boolean` (DEFAULT false)
    * `created_at`: `timestamp` (DEFAULT now ())
* **Columns (`chatroom_messages`)**:
    * `id`: `uuid` (PK)
    * `chatroom_id`: `uuid` (FK -> `chatrooms.id`, NOT NULL)
    * `author_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `author_id`: `uuid` (NOT NULL)
    * `message`: `text` (NOT NULL)
    * `created_at`: `timestamp` (DEFAULT now ())
    * `deleted_at`: `timestamp` (nullable)

#### Behavioural Details

* Dedicated chat room route with topic header and user list.
* Mod tools for message management and user timeouts.

#### Unknowns

* Real-time transport implementation choice and deferral timeline for Phase 2/3.

---

### Posts / Comments (Attachable Interactions)

#### Overview

* Generic attachable comment sub-system attachable to any entity (blogs, profiles, guild pages).

#### Expanded details

* **Attachable Architecture**: Uses `(target_module, target_record_id)` polymorphic keys. Automatically inherits
  sanitization, word filtering, moderation, reactions, and notifications.

#### Table Details

* **Table Name**: `comments`
* **Columns**:
    * `id`: `uuid` (PK)
    * `target_module`: `varchar(32)` (NOT NULL) — 'BLOG_POST', 'USER_PROFILE', 'CHARACTER_PROFILE', 'GUILD'
    * `target_record_id`: `uuid` (NOT NULL)
    * `author_type`: `varchar(16)` ('USER' or 'CHARACTER')
    * `author_id`: `uuid` (NOT NULL)
    * `content`: `text` (NOT NULL)
    * `parent_comment_id`: `uuid` (nullable FK -> `comments.id` for light threading)
    * `created_at`: `timestamp` (DEFAULT now ())
    * `updated_at`: `timestamp` (DEFAULT now ())
    * `deleted_at`: `timestamp` (nullable)

#### Behavioural Details

* Attaches comment threads to target records.
* Authors can edit and soft-delete; mods can delete/moderate. Supports reactions and @mentions.

#### Unknowns

* Maximum allowed nesting depth for comment replies (1-level deep vs flat).

---

### Additional Concepts

#### Overview

* System-wide infrastructure utilities including Tagging, Global Subscriptions, Economy, Rate Limiting, and Full-Text
  Search.

#### Expanded details

* **Subscriptions**: Generic `subscriptions` table `(subscriber_id, target_module, target_record_id)`.
* **Economy**: Earn points via active posting/interacting; spend on shop items.
* **Rate Limiting**: Middleware flood prevention for chatbox, chatroom, and DMs.
* **Search**: Full-text indexing across forums, blogs, and profiles.

#### Table Details

* **Table Names**: `tags`, `entity_tags`, `subscriptions`, `user_economy_transactions`
* **Columns (`subscriptions`)**:
    * `id`: `uuid` (PK)
    * `subscriber_id`: `uuid` (FK -> `users.id`, NOT NULL)
    * `target_module`: `varchar(32)` (NOT NULL) — 'BLOG', 'GUILD', 'CHARACTER', 'USER'
    * `target_record_id`: `uuid` (NOT NULL)
    * `created_at`: `timestamp` (DEFAULT now ())

#### Behavioural Details

* Users can tag posts and subscribe to blogs/guilds/users.
* Rate limiting prevents spam bursts. Search enables text querying across modules.

#### Unknowns

* Search engine choice: Native Postgres `tsvector` vs Meilisearch / Typesense.
