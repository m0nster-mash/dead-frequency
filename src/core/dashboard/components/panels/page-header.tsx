"use client";
import styles from "@/shared/styles/content-panel.module.css";
import {JSX, useState} from "react";

/**
 * Structural definition for an individual reference item inside the table of contents list.
 *
 * @property {string} id - The specific link anchor string corresponding to the destination element ID on the page.
 * @property {string} label - The readable display name text representing the section heading link.
 * @property {2 | 3 | 4} [level=2] - The hierarchical heading depth weight (ex. h2, h3, h4).
 */
type TableOfContentsItem = {
    id: string;
    label: string;
    level?: 2 | 3 | 4;
};

/**
 * Properties for the PageHeader component.
 *
 * @property {string} eyebrow - Small contextual label banner text rendered directly above the primary page title.
 * @property {string} title - Primary heading string defining the layout scope or current view state.
 * @property {string} subtitle - Secondary text description summarizing page actions or structural content data blocks.
 * @property {TableOfContentsItem[]} [items=[]] - Collection array specifying inline internal on-page anchor link items.
 */
type PageHeaderProps = {
    eyebrow: string;
    title: string;
    subtitle: string;
    items?: TableOfContentsItem[];
};

/**
 * An interactive Client Component providing branding, contextual descriptions, and collapsible table-of-contents
 * widgets. Integrates accessibility attributes to assist screen readers and handle keyboard-focus patterns seamlessly.
 *
 * @param {PageHeaderProps} props - The component properties.
 *
 * @returns {JSX.Element} The visual structural view page header layout container.
 */
export function PageHeader({eyebrow, title, subtitle, items = []}: PageHeaderProps): JSX.Element {
    const [isTocOpen, setIsTocOpen] = useState(false);

    return (
        <header className={styles.contentHeader}>
            <div className={styles.contentHeaderMain}>
                <div>
                    <p className={styles.eyebrow}>{eyebrow}</p>
                    <h1>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
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
                            {/* TODO:: replace ↓ with SVG */}
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
                                        {/* Forces items to lose keyboard index focus thresholds (`-1`) when hidden to
                                            prevent invisible keyboard trap issues on focus trees. */}
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
