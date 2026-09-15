import {AvatarConfig} from "../lib/types";
import HeadBase from "../assets/base/base_1.svg";
import Eyes01 from "../assets/eyes/eyes_1.svg";
import Eyes02 from "../assets/eyes/eyes_2.svg";
import Hair01 from "../assets/hair/hair_1.svg";
import Hair02 from "../assets/hair/hair_2.svg";
import Mouth01 from "../assets/mouth/mouth_1.svg";
import Mouth02 from "../assets/mouth/mouth_2.svg";
import {ComponentType, JSX} from "react";

const EYES_MAP: Record<string, ComponentType> = {
    "eyes-01": Eyes01,
    "eyes-02": Eyes02
};

const MOUTH_MAP: Record<string, ComponentType> = {
    "mouth-01": Mouth01,
    "mouth-02": Mouth02
};

const HAIR_MAP: Record<string, ComponentType> = {
    "hair-01": Hair01,
    "hair-02": Hair02
};

type AvatarRendererProps = {
    config: AvatarConfig;
    size?: number;
    className?: string;
};

export function AvatarRenderer({config, size = 96, className}: AvatarRendererProps): JSX.Element {
    const Eyes = EYES_MAP[config.eyes];
    const Mouth = MOUTH_MAP[config.mouth];
    const Hair = HAIR_MAP[config.hair];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 240 240"
            role="img"
            aria-label="User avatar"
            className={className}>
            <HeadBase/>
            {Eyes ? <Eyes/> : null}
            {Mouth ? <Mouth/> : null}
            {Hair ? <Hair/> : null}
        </svg>
    );
}
