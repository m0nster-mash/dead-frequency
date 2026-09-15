"use client";

import {useRouter} from "next/navigation";
import {JSX, useState} from "react";
import {AVATAR_OPTIONS, AvatarPartCategory} from "../lib/options";
import {AvatarConfig} from "../lib/types";
import {useAvatar} from "./avatar-provider";
import {AvatarRenderer} from "./avatar-renderer";

type AvatarBuilderProps = {
    initialConfig: AvatarConfig;
};

const CATEGORIES: { key: AvatarPartCategory; label: string }[] = [
    {key: "eyes", label: "Eyes"},
    {key: "mouth", label: "Mouth"},
    {key: "hair", label: "Hair"},
];

export function AvatarBuilder({initialConfig}: AvatarBuilderProps): JSX.Element {
    const router = useRouter();
    const {saveAvatarConfig} = useAvatar();
    const [config, setConfig] = useState<AvatarConfig>(initialConfig);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    function updatePart(category: AvatarPartCategory, id: string) {
        setConfig((prev) => ({...prev, [category]: id}));
    }

    async function handleSave() {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const result = await saveAvatarConfig(config);

        if (!result.success) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setSuccess("Avatar updated");
        setLoading(false);
        router.refresh();
    }

    return (
        <div>
            <div>
                <AvatarRenderer config={config} size={160}/>

                <div>
                    {CATEGORIES.map(({key, label}) => (
                        <div key={key}>
                            <label>{label}</label>
                            <div>
                                {AVATAR_OPTIONS[key].map((option) => (
                                    <button key={option.id}
                                            type="button"
                                            onClick={() => updatePart(key, option.id)}
                                            style={{fontWeight: config[key] === option.id ? 700 : 400,}}>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {error ? <p>{error}</p> : null}
            {success ? <p>{success}</p> : null}

            <div>
                <button type="button"
                        disabled={loading}
                        onClick={handleSave}>
                    {loading ? "Saving..." : "Save avatar"}
                </button>
            </div>
        </div>
    );
}
