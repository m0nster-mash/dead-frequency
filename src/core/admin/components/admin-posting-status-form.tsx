"use client";

import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import formStyles from "@/shared/styles/form.module.css";
import buttonStyles from "@shared/styles/buttons.module.css";
import {JSX, useState} from "react";

/**
 * Properties for the AdminPostingStatusForm component.
 *
 * @property {string} userId - The unique identifier of the target user whose status is being modified.
 * @property {(formData: FormData) => Promise<void>} onSubmitAction - Server Action function triggered to commit
 *                                                                    updates to the platform.
 */
type Props = {
    userId: string;
    onSubmitAction: (formData: FormData) => Promise<void>;
};

/**
 * Valid isolated feature modules supported by the communication sub-systems.
 */
const MODULES = ["forum", "chatbox", "chatroom", "dm"] as const;

/**
 * Restrictive enforcement states available for deployment against target accounts.
 */
const STATUSES = ["active", "muted", "shadowbanned", "banned"] as const;

/**
 * Provides granular account standing and restriction controls. Allows administrators to assign localized moderation
 * parameters against standalone sub-systems, or globally override access clearances across the entire site ecosystem.
 *
 * @param {Props} props - The component properties.
 *
 * @returns {JSX.Element} The visual moderator adjustment control layout panel.
 */
export function AdminPostingStatusForm({userId, onSubmitAction}: Props): JSX.Element {
    const [module, setModule] = useState<string>("");

    return (
        <MainContentPanel title={"Posting Status"}>
            <form className={formStyles.form} action={onSubmitAction}>
                <input type="hidden" name="userId" value={userId}/>

                <div className={formStyles.formField}>
                    <label className={formStyles.formLabel}>Scope</label>
                    <select name="module"
                            className={formStyles.formInput}
                            value={module}
                            onChange={(e) => setModule(e.target.value)}>
                        <option value="">Site-wide</option>
                        {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <div className={formStyles.formField}>
                    <label className={formStyles.formLabel}>Status</label>
                    <select name="status"
                            className={formStyles.formInput}
                            defaultValue="muted">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className={formStyles.formField}>
                    <label className={formStyles.formLabel}>Reason</label>
                    <input name="reason" className={formStyles.formInput}/>
                </div>

                <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>Apply</button>
            </form>
        </MainContentPanel>
    );
}
