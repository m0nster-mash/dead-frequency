"use client";
import React, {JSX} from "react";

/**
 * Properties for the LoremIpsum component.
 *
 * @property {number} length - The number of standalone text paragraphs to output.
 * @property {boolean} regular - Enforces exact standard filler copy text if true; outputs variable randomized word
 *                               counts if false.
 */
type LoremIpsumProps = {
    length: number;
    regular: boolean;
};

/**
 * Standard baseline text string constant used globally for predictable typography tests.
 */
const STANDARD_PARAGRAPH = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
    "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco " +
    "laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit " +
    "esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui " +
    "officia deserunt mollit anim id est laborum.";

/**
 * Normalized lookup array containing clean individual punctuation-free text blocks. Formatted dynamically by
 * stripping special boundary markers to simplify array modular math operations.
 */
const LOREM_WORDS = STANDARD_PARAGRAPH.replace(/[.,]/g, "").split(/\s+/);

/**
 * Utility string generator script that builds a single randomized sentence paragraph layer. Caps ranges and
 * auto-capitalizes the initial character trace to emulate realistic presentation layouts.
 *
 * @param {number} minWords - Minimum length boundary parameter defining word lengths.
 * @param {number} maxWords - Maximum length boundary parameter defining word lengths.
 *
 * @returns {string} The fully compiled randomized dummy paragraph copy text.
 */
function generateParagraph(minWords: number, maxWords: number): string {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;

    // Assembles strings sequentially by looping indices modulo across clean vocabulary resource arrays
    const words = Array.from({length: wordCount},
        (_, index) => LOREM_WORDS[index % LOREM_WORDS.length]);

    // Enforces proper sentence casings using a replacement macro regex
    return (words.join(" ").replace(/^./, (char) => char.toUpperCase()) + ".");
}

/**
 * A Client Component placeholder utility that generates variable lengths of text copy paragraphs. Primarily deployed
 * within grid layout shells during early developmental phases to assess padding, line heights, and typography balance
 * constraints.
 *
 * @param {LoremIpsumProps} props - The component properties.
 * @returns {JSX.Element | null} The visual paragraph block array, or null if the length parameter resolves
 *                               underneath zero.
 */
export default function LoremIpsum({length, regular}: LoremIpsumProps): JSX.Element | null {
    const count = Math.max(0, Math.floor(length));

    if (count === 0) {
        return null;
    }

    const paragraphs = regular
        ? Array.from({length: count}, () => STANDARD_PARAGRAPH)
        : Array.from({length: count}, () => generateParagraph(30, 100));

    return (
        <div>
            {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
    );
}
