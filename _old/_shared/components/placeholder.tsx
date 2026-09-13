import {JSX} from "react";

/**
 * Properties for the Placeholder object
 *
 * @property {string} text - the label for the placeholder property
 */
type PlaceholderProps = {
    text: string;
};

/**
 * Displays placeholder text in a simple stylized object, making it easier to visually identify placeholder content.
 */
export default function Placeholder({text}: PlaceholderProps): JSX.Element | null {

    return (
        <span style={{
            background: "#000",
            color: "#fff"
        }}>
            [ {text.toLocaleUpperCase()} ]
        </span>
    );
}
