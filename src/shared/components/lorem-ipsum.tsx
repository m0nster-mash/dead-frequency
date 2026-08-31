"use client";
import React from "react";

type LoremIpsumProps = {
    length: number;
    regular: boolean;
};

const STANDARD_PARAGRAPH = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
    "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco " +
    "laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit " +
    "esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui " +
    "officia deserunt mollit anim id est laborum.";
const LOREM_WORDS = STANDARD_PARAGRAPH.replace(/[.,]/g, "").split(/\s+/);

function generateParagraph(minWords: number, maxWords: number): string {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = Array.from({length: wordCount},
        (_, index) => LOREM_WORDS[index % LOREM_WORDS.length]);

    return (words.join(" ").replace(/^./, (char) => char.toUpperCase()) + ".");
}

export default function LoremIpsum({length, regular,}: LoremIpsumProps) {
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
        </div>);
}