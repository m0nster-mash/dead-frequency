"use client";

import buttonStyles from "@/shared/styles/buttons.module.css";
import panelStyles from "@/shared/styles/panel.module.css";
import cardStyles from "@/shared/styles/patterns/card.module.css";
import {JSX, ReactNode} from "react";

/**
 * Properties for the MainContentPanel component.
 *
 * @property {string} title - Primary title header displayed at the top of the container card section.
 * @property {ReactNode} children - Dynamic inner elements or text layouts wrapped inside the body block.
 * @property {string} [description] - Optional sub-text subtitle block providing section context.
 * @property {string} [id] - Optional custom anchor link string. Automatically computed from the title string if
 *                           omitted.
 * @property {boolean} [showBackToTop=true] - Toggles the presentation of the scroll anchor link.
 * @property {string} [className=""] - Optional supplemental utility class string appended directly onto the outer
 *                                     element wrapper.
 */
type MainContentPanelProps = {
    title: string;
    children: ReactNode;
    description?: string;
    id?: string;
    showBackToTop?: boolean;
    className?: string;
};

/**
 * A standardized dashboard layout panel. Includes title configurations, optional subtitle fields, and built-in
 * semantic anchor links.
 *
 * @param {MainContentPanelProps} props - The component properties.
 *
 * @returns {JSX.Element} The visual content layout dashboard block wrapper.
 */
export function MainContentPanel({
                                     title,
                                     children,
                                     description,
                                     id,
                                     showBackToTop = true,
                                     className = "",
                                 }: MainContentPanelProps): JSX.Element {

    // Resolves a stable reference link mapping explicit target strings or automated slug formats
    const sectionId = id ?? slugify(title);

    return (
        <section className={`${panelStyles.panel} ${className}`}>
            <div className={panelStyles.panelHeader}>
                <div>
                    <h2 className={panelStyles.panelHeaderTitle} id={sectionId}>{title}</h2>
                    {description && (<p className={panelStyles.panelHeaderDescription}>{description}</p>)}
                </div>
            </div>

            <div className={panelStyles.panelBody}>{children}</div>

            {/* Routes window scroll focus point straight back up to global parent boundary elements. */}

            {showBackToTop && (
                <a href={"#top"}
                   className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnSubtle} ${cardStyles.cardBackToTop}`}
                   style={{display: "inline-flex", alignItems: "center", justifyContent: "center"}}
                   aria-label="Back to top of page">
                    ↑
                </a>
            )}
        </section>
    );
}

/**
 * Utility helper transforming regular text strings into safe, standardized link anchor labels. Strips special glyph
 * sequences and replaces white spaces with structural hyphens.
 *
 * @param {string} text - The raw title string to be transformed.
 *
 * @returns {string} The formatted web-safe slug string.
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Erases all characters that are not alphanumeric characters, spaces, or dashes
        .replace(/\s+/g, "-")     // Compresses multi-space spaces down into a single hyphen string
        .replace(/-+/g, "-");    // Prevents trailing stacked dashes from accumulating inside strings
}
