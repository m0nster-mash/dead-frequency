import Link from "next/link";
import styles from "@/feature/forum/styles/forum.module.css";

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
            <div className={styles.empty}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={styles.boardList}>
            {boards.map((board) => (
                <article
                    key={board.id}
                    className={styles.board}
                >
                    <div className={styles.boardMain}>
                        <Link
                            href={board.href}
                            className={styles.boardName}
                        >
                            {board.name}
                        </Link>

                        <p className={styles.boardDescription}>
                            {board.description || "—"}
                        </p>
                    </div>

                    <div className={styles.boardActivity}>
                        <div className={styles.latestThread}>
                            <span className={styles.label}>
                                Latest thread
                            </span>

                            <span className={styles.threadName}>
                                {board.latestThread?.name || "[THREAD_NAME]"}
                            </span>

                            <span className={styles.threadAuthor}>
                                by{" "}
                                {board.latestThread?.author || "[AUTHOR_NAME]"}
                            </span>
                        </div>

                        <div className={styles.boardStats}>
                            <div className={styles.stat}>
                                <span className={styles.statValue}>
                                    {board.threadTotal ?? "[THREAD_TOTAL]"}
                                </span>

                                <span className={styles.statLabel}>
                                    Threads
                                </span>
                            </div>

                            <div className={styles.stat}>
                                <span className={styles.statValue}>
                                    {board.postTotal ?? "[POST_TOTAL]"}
                                </span>

                                <span className={styles.statLabel}>
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
