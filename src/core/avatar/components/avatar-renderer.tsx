
import HeadBase from "@/core/avatar/assets/base/base_1.svg";
import Eyes01 from "@/core/avatar/assets/eyes/eyes_1.svg";
import Eyes02 from "@/core/avatar/assets/eyes/eyes_2.svg";
import Mouth01 from "@/core/avatar/assets/mouth/mouth_1.svg";
import Mouth02 from "@/core/avatar/assets/mouth/mouth_2.svg";
import Background01 from "@/core/avatar/assets/background/background_1.svg";
import Background02 from "@/core/avatar/assets/background/background_2.svg";
import Hair01 from "@/core/avatar/assets/hair/hair_1.svg";
import Hair02 from "@/core/avatar/assets/hair/hair_2.svg";

import {AvatarConfig} from "@/core/avatar/lib/types";
import {ComponentType} from "react";

const EYES_MAP: Record<string, ComponentType> = {
    "eyes-01": Eyes01,
    "eyes-02": Eyes02
};

const MOUTH_MAP: Record<string, ComponentType> = {
    "mouth-01": Mouth01,
    "mouth-02": Mouth02
};

const BACKGROUND_MAP: Record<string, ComponentType> = {
    "background-01": Background01,
    "background-02": Background02
};

const HAIR_MAP: Record<string, ComponentType> = {
    "hair-01": Hair01,
    "hair-02": Hair02
}

type AvatarRendererProps = {
    config: AvatarConfig;
    size?: number;
    className?: string;
};

export function AvatarRenderer({config, size = 96, className}: AvatarRendererProps) {
    const Background = BACKGROUND_MAP[config.background];
    const Eyes = EYES_MAP[config.eyes];
    const Mouth = MOUTH_MAP[config.mouth];
    const Hair = HAIR_MAP[config.hair];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            role="img"
            aria-label="User avatar"
            className={className}>
            {Background ? <Background/> : null}
            <HeadBase/>
            {Eyes ? <Eyes/> : null}
            {Mouth ? <Mouth/> : null}
            {Hair ? <Hair/> : null}
        </svg>
    );
}