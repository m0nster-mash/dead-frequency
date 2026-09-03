"use client";

import {AvatarRenderer} from "@/feature/avatar/components/avatar-renderer";
import {saveAvatarConfig} from "@/feature/avatar/lib/actions";
import {AVATAR_OPTIONS, AvatarPartCategory,} from "@/feature/avatar/lib/options";
import {AvatarConfig} from "@/feature/avatar/lib/types";
import styles from "@/shared/styles/form-panel.module.css";
import {useRouter} from "next/navigation";
import {JSX, useState} from "react";

/**
 * Properties for the AvatarBuilder component.
 *
 * @property {AvatarConfig} initialConfig - The initial visual layout parameters of the user's avatar character.
 */
type AvatarBuilderProps = {
    initialConfig: AvatarConfig;
};

/**
 * Static schema collection mapping out vector part categories with human-readable menu labels.
 */
const CATEGORIES: { key: AvatarPartCategory; label: string }[] = [
    {key: "eyes", label: "Eyes"},
    {key: "mouth", label: "Mouth"},
    {key: "hair", label: "Hair"},
];

/**
 * An interactive Client Component studio interface allowing members to customize their vector avatar character profiles.
 * Displays real-time asset modifications via a decoupled layout layer and saves configs via server action.
 *
 * @param {AvatarBuilderProps} props - The component properties.
 * @returns {JSX.Element} The visual vector asset assembly studio dashboard workspace.
 */
export function AvatarBuilder({initialConfig}: AvatarBuilderProps): JSX.Element {
    const router = useRouter();
    const [config, setConfig] = useState<AvatarConfig>(initialConfig);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    /**
     * Swaps out an asset component block index parameter matching targeted customization scopes.
     * Alters local visual properties instantaneously to enable interactive studio feedback.
     *
     * @param {AvatarPartCategory} category - The design scope identifier being swapped (e.g., "eyes", "mouth").
     * @param {string} id - The specific vector item part identity string map selected by the member.
     */
    function updatePart(category: AvatarPartCategory, id: string) {
        setConfig((prev) => ({...prev, [category]: id}));
    }

    /**
     * Dispatches current structural design configurations to persistent storage handlers.
     * Manages operation loading flags and validates response records.
     */
    async function handleSave() {
        setLoading(true);
        setError(null);
        setSuccess(null); // Resets legacy confirmation notices before firing new mutation requests

        // Invokes the corresponding server data layer handler to persist configuration structures
        const result = await saveAvatarConfig(config);

        if (!result.success) {
            setError(result.error);
            setLoading(false);
            return;
        }

        setSuccess("Avatar updated");
        setLoading(false);
        router.refresh(); // Signals Next.js layout trees to flush client state caches, fetching updated graphical layers
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
