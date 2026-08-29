"use client";

import {useEffect, useState} from "react";

export type TableOfContentsItem = {
    id: string;
    label: string;
    level?: 2 | 3 | 4;
};

type TableOfContentsProps = {
    items?: TableOfContentsItem[];
    selector?: string;
    title?: string;
    className?: string;
};

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function TableOfContents({
                                    items,
                                    selector = "[data-toc-content] h2, [data-toc-content] h3",
                                    title = "Table of contents",
                                    className = "",
                                }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TableOfContentsItem[]>(items ?? []);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (items) {
            setHeadings(items);
            return;
        }

        const elements = Array.from(
            document.querySelectorAll<HTMLHeadingElement>(selector)
        );

        const usedIds = new Set<string>();

        const discovered = elements.map((heading) => {
            let id = heading.id || slugify(heading.textContent || "section");

            // Prevent duplicate IDs when two headings have the same text.
            const baseId = id;
            let count = 2;

            while (usedIds.has(id)) {
                id = `${baseId}-${count}`;
                count++;
            }

            usedIds.add(id);

            if (!heading.id) {
                heading.id = id;
            }

            return {
                id,
                label: heading.textContent?.trim() || id,
                level: Number(heading.tagName.substring(1)) as 2 | 3 | 4,
            };
        });

        setHeadings(discovered);
    }, [items, selector]);

    useEffect(() => {
        if (!headings.length) return;

        const elements = headings
            .map(({id}) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) =>
                        a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible[0]) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                rootMargin: "-10% 0px -70% 0px",
                threshold: 0,
            }
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [headings]);

    if (!headings.length) return null;

    return (
        <nav aria-label={title}
             className={`table-of-contents ${className}`}>
            <p className="table-of-contents__title">{title}</p>

            <ol className="table-of-contents__list">
                {headings.map((item) => (
                    <li key={item.id}
                        className={`table-of-contents__item table-of-contents__item--level-${item.level ?? 2}`}>
                        <a href={`#${item.id}`}
                           aria-current={activeId === item.id ? "location" : undefined}
                           className={
                               activeId === item.id
                                   ? "table-of-contents__link table-of-contents__link--active"
                                   : "table-of-contents__link"}>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}