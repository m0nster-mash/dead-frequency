import {AvatarConfig} from "../lib/types";
import HeadBase from "../assets/base/base_1.svg";
import Eyes01 from "../assets/eyes/eyes_1.svg";
import Eyes02 from "../assets/eyes/eyes_2.svg";
import Hair01 from "../assets/hair/hair_1.svg";
import Hair02 from "../assets/hair/hair_2.svg";
import Mouth01 from "../assets/mouth/mouth_1.svg";
import Mouth02 from "../assets/mouth/mouth_2.svg";
import {ComponentType, JSX} from "react";

/**
 * Registry dictionary mapping eyes asset unique key references to React SVG subcomponents.
 */
const EYES_MAP: Record<string, ComponentType> = {
    "eyes-01": Eyes01,
    "eyes-02": Eyes02
};

/**
 * Registry dictionary mapping mouth asset unique key references to React SVG subcomponents.
 */
const MOUTH_MAP: Record<string, ComponentType> = {
    "mouth-01": Mouth01,
    "mouth-02": Mouth02
};

/**
 * Registry dictionary mapping hair asset unique key references to React SVG subcomponents.
 */
const HAIR_MAP: Record<string, ComponentType> = {
    "hair-01": Hair01,
    "hair-02": Hair02
};

/**
 * Properties for the AvatarRenderer component.
 *
 * @property {AvatarConfig} config - Structured key matrix containing active part customization indices.
 * @property {number} [size=96] - Numeric scaling factor governing rendering envelope widths and heights.
 * @property {string} [className] - Optional supplemental style configuration utilities class string.
 */
type AvatarRendererProps = {
    config: AvatarConfig;
    size?: number;
    className?: string;
};

/**
 * A declarative component canvas that loads and composites layered SVG assets based on custom property data profiles.
 *
 * @param {AvatarRendererProps} props - The component properties.
 *
 * @returns {JSX.Element} The composite user avatar vector graphic composition canvas.
 */
export function AvatarRenderer({config, size = 96, className}: AvatarRendererProps): JSX.Element {
    const Eyes = EYES_MAP[config.eyes];
    const Mouth = MOUTH_MAP[config.mouth];
    const Hair = HAIR_MAP[config.hair];

    return (
        /**
         *  Constructs the parent SVG graphic boundary window envelope. Uses semantic image role markings and
         *  descriptive aria-labels to maintain accessibility visibility parameters.
         */
        <svg
            width={size}
            height={size}
            viewBox="0 0 240 240" // Scalable relative grid container coordinate bounds matching asset aspect rules
            role="img"
            aria-label="User avatar"
            className={className}>

            {/* LAYER 1:
                baseline underlying head anatomy vector (Always painted first on bottom-most depths) */}
            <HeadBase/>

            {/* LAYER 2:
                independent facial feature templates sandwiching elements over baseline curves */}
            {Eyes ? <Eyes/> : null}
            {Mouth ? <Mouth/> : null}

            {/* LAYER 3:
                hair geometries overlaid on top of previous visual elements */}
            {Hair ? <Hair/> : null}
        </svg>
    );
}
