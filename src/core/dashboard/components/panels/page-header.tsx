"use client";
import {useState} from "react";
import styles from "@/shared/styles/content-panel.module.css";

type TableOfContentsItem = {
    id: string;
    label: string;
    level?: 2 | 3 | 4;
};

type PageHeaderProps = {
    eyebrow: string;
    title: string;
    subtitle: string;
    actionLabel?: string;
    onAction?: () => void;
    items?: TableOfContentsItem[];
};

export function PageHeader({eyebrow, title, subtitle, actionLabel, onAction, items = [],}: PageHeaderProps) {

    const [isTocOpen, setIsTocOpen] = useState(false);

    return (
        <header className={styles.contentHeader}>
            <div className={styles.contentHeaderMain}>
                <div>
                    <p className={styles.eyebrow}>{eyebrow}</p>
                    <h1>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
                {actionLabel && (
                    <button type="button" className={styles.primaryButton} onClick={onAction}>
                        <span>+</span> {actionLabel}
                    </button>
                )}
            </div>
            {items.length > 0 && (
                <>
                    <div className={styles.contentHeaderTocToggle}>
                        <button type="button"
                                className={styles.tableOfContentsButton}
                                onClick={() => setIsTocOpen((open) => !open)}
                                aria-expanded={isTocOpen}
                                aria-controls="page-table-of-contents">
                            <span>Table of Contents</span>
                            <span className={`${styles.tableOfContentsButtonIcon} ${isTocOpen
                                ? styles.tableOfContentsButtonIconOpen
                                : ""}`}
                                  aria-hidden="true"> ↓ </span>
                        </button>
                    </div>
                    <div id="page-table-of-contents"
                         className={isTocOpen
                             ? `${styles.contentHeaderToc} ${styles.contentHeaderTocOpen}`
                             : styles.contentHeaderToc}>
                        <nav aria-label="Table of contents">
                            <p className={styles.contentHeaderTocTitle}> On this page </p>
                            <ol className={styles.contentHeaderTocList}>
                                {items.map((item) => (
                                    <li key={item.id} className={styles.contentHeaderTocItem}>
                                        <a href={`#${item.id}`}
                                           tabIndex={isTocOpen ? 0 : -1}
                                           onClick={() => setIsTocOpen(false)}> {item.label} </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
}