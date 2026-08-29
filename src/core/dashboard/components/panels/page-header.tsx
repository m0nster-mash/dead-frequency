"use client";
import {useState} from "react";

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
        <header className="content-header">
            <div className="content-header__main">
                <div>
                    <p className="eyebrow">{eyebrow}</p>
                    <h1>{title}</h1>
                    <p className="subtitle">{subtitle}</p>
                </div>

                {actionLabel && (
                    <button type="button"
                            className="primary-button"
                            onClick={onAction}>
                        <span>+</span> {actionLabel}
                    </button>)}
            </div>
            {items.length > 0 && (
                <>
                    <div className="content-header__toc-toggle">
                        <button type="button"
                                className="table-of-contents-button"
                                onClick={() => setIsTocOpen((open) => !open)}
                                aria-expanded={isTocOpen}
                                aria-controls="page-table-of-contents">
                            <span>Table of Contents</span>
                            <span
                                className={
                                    `table-of-contents-button__icon 
                                    ${isTocOpen ? "table-of-contents-button__icon--open" : ""}`}
                                aria-hidden="true"> ↓ </span>
                        </button>
                    </div>

                    <div id="page-table-of-contents"
                         className={
                             `content-header__toc 
                             ${isTocOpen ? "content-header__toc--open" : ""}`}>
                        <nav aria-label="Table of contents">
                            <p className="content-header__toc-title"> On this page </p>
                            <ol className="content-header__toc-list">
                                {items.map((item) => (
                                    <li key={item.id}
                                        className={`content-header__toc-item content-header__toc-item--level-${item.level ?? 2}`}>
                                        <a href={`#${item.id}`} tabIndex={isTocOpen ? 0 : -1}
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