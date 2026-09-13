import forumStyles from "@/_feature/forum/styles/forum.module.css";
import Placeholder from "@/_shared/components/placeholder";
import Link from "next/link";

export type BoardDisplayItem = {
    id: string;
    name: string;
    description?: string | null;
    href: string;

    latestThread?: {
        name: string;
        author: string;
    };

    threadTotal?: string | number;
    postTotal?: string | number;
};

type BoardDisplayProps = {
    boards: BoardDisplayItem[];
    emptyMessage?: string;
};

export function BoardDisplay({
                                 boards,
                                 emptyMessage = "No boards yet.",
                             }: BoardDisplayProps) {
    if (boards.length === 0) {
        return (
            <div className={forumStyles.discussionEmpty}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={forumStyles.boardList}>
            {boards.map((board) => (
                <article key={board.id}
                         className={forumStyles.boardRow}>
                    <div className={forumStyles.boardMain}>
                        <Link href={board.href}
                              className={forumStyles.boardName}>
                            {board.name}
                        </Link>

                        <p className={forumStyles.boardDescription}>
                            {board.description || "—"}
                        </p>
                    </div>

                    <div className={forumStyles.boardActivity}>
                        <div className={forumStyles.latestThread}>
                            <span className={forumStyles.metaLabel}>
                                Latest thread
                            </span>

                            <span className={forumStyles.threadName}>
                                {board.latestThread?.name || <Placeholder text={"thread_name"}/>}
                            </span>

                            <span className={forumStyles.threadAuthor}>
                                by{" "}
                                {board.latestThread?.author || <Placeholder text={"author_name"}/>}
                            </span>
                        </div>

                        <div className={forumStyles.boardStats}>
                            <div className={forumStyles.stat}>
                                <span className={forumStyles.statValue}>
                                    {board.threadTotal ?? <Placeholder text={"thread_total"}/>}
                                </span>

                                <span className={forumStyles.metaLabel}>
                                    Threads
                                </span>
                            </div>

                            <div className={forumStyles.stat}>
                                <span className={forumStyles.statValue}>
                                    {board.postTotal ?? <Placeholder text={"post_total"}/>}
                                </span>

                                <span className={forumStyles.metaLabel}>
                                    Posts
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
