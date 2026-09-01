"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {AvatarRenderer} from "@/feature/avatar/components/avatar-renderer";
import {
    AVATAR_OPTIONS,
    AvatarPartCategory,
} from "@/feature/avatar/lib/options";
import {AvatarConfig, AVATAR_CONFIG_VERSION} from "@/feature/avatar/lib/types";
import {saveAvatarConfig} from "@/feature/avatar/lib/actions";
import styles from "@/shared/styles/form-panel.module.css";

type AvatarBuilderProps = {
    initialConfig: AvatarConfig;
};

const CATEGORIES: {key: AvatarPartCategory; label: string}[] = [
    {key: "eyes", label: "Eyes"},
    {key: "mouth", label: "Mouth"},
    {key: "background", label: "Background"},
    {key: "hair", label: "Hair"},
];

export function AvatarBuilder({initialConfig}: AvatarBuilderProps) {
    const router = useRouter();
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
        <div className={styles.section}>
            <div style={{display: "flex", gap: "2rem", alignItems: "flex-start"}}>
                <AvatarRenderer config={config} size={160}/>

                <div style={{flex: 1}}>
                    {CATEGORIES.map(({key, label}) => (
                        <div key={key} className={styles.field}>
                            <label className={styles.label}>{label}</label>
                            <div style={{display: "flex", gap: "0.5rem"}}>
                                {AVATAR_OPTIONS[key].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => updatePart(key, option.id)}
                                        className={styles.input}
                                        style={{
                                            fontWeight: config[key] === option.id ? 700 : 400,
                                        }}>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}
            {success ? <p className={styles.success}>{success}</p> : null}

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.submit}
                    disabled={loading}
                    onClick={handleSave}>
                    {loading ? "Saving..." : "Save avatar"}
                </button>
            </div>
        </div>
    );
}