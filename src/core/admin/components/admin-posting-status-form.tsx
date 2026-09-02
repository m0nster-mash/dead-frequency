"use client";

import {useState} from "react";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import styles from "@/shared/styles/form-panel.module.css";

type Props = {
    userId: string;
    // server action, defined alongside setPostingStatus in a "use server" file
    onSubmitAction: (formData: FormData) => Promise<void>;
};

const MODULES = ["forum", "chatbox", "chatroom", "dm"] as const;
const STATUSES = ["active", "muted", "shadowbanned", "banned"] as const;

export function AdminPostingStatusForm({userId, onSubmitAction}: Props) {
    const [module, setModule] = useState<string>("");
    return (
        <MainContentPanel title={"Posting Status"}>
            <form className={styles.form} action={onSubmitAction}>
                <input type="hidden" name="userId" value={userId}/>
                <div className={styles.field}>
                    <label className={styles.label}>Scope</label>
                    <select name="module"
                            className={styles.input}
                            value={module}
                            onChange={(e) => setModule(e.target.value)}>
                        <option value="">Site-wide</option>
                        {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Status</label>
                    <select name="status" className={styles.input} defaultValue="muted">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Reason</label>
                    <input name="reason" className={styles.input}/>
                </div>
                <button type="submit" className={styles.submit}>Apply</button>
            </form>
        </MainContentPanel>
    );
}
