"use client";

import {ReactNode} from "react";

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
        <section className={`card main-content-card ${className}`}>
            <div className="card-header">
                <div>
                    <h2 id={sectionId}>{title}</h2>
                    {description && (<p>{description}</p>)}
                </div>
            </div>

            <div className="main-content-card__body">
                {children}
            </div>

            {showBackToTop && (
                <a href="#top"
                   className="back-to-top-button"
                   aria-label="Back to top of page"> ↑ </a>
            )}
        </section>
    );
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
