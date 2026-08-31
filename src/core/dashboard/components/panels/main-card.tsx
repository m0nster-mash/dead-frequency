"use client";

import {ReactNode} from "react";
import styles from "@/shared/styles/content-panel.module.css";

type MainContentPanelProps = {
    title: string;
    children: ReactNode;
    description?: string;
    id?: string;
    showBackToTop?: boolean;
    className?: string;
};

export function MainContentPanel({
                                     title,
                                     children,
                                     description,
                                     id,
                                     showBackToTop = true,
                                     className = "",
                                 }: MainContentPanelProps) {

    const sectionId = id ?? slugify(title);
    return (
        <section className={`${styles.card} ${styles.mainContentCard} ${className}`}>
            <div className={styles.cardHeader}>
                <div>
                    <h2 id={sectionId}>{title}</h2>
                    {description && (<p>{description}</p>)}
                </div>
            </div>
            <div className={styles.mainContentCardBody}> {children} </div>
            {showBackToTop && (
                <a href="#top" className={styles.backToTopButton} aria-label="Back to top of page"> ↑ </a>)}
        </section>);
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
