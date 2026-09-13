"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { submitReportAction } from "@/shared/communication/interactions/lib/actions";
import { reportReasonEnum } from "@/shared/communication/interactions/schema/interactions.schema";
import { moduleEnum } from "@/shared/communication/moderation/schema/moderation.schema";

import modalStyles from "@/shared/styles/modal.module.css";
import formStyles from "@/shared/styles/form.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";

type TargetModule = (typeof moduleEnum.enumValues)[number];
type ReportReason = (typeof reportReasonEnum.enumValues)[number];

type ReportPanelProps = {
    module: TargetModule;
    recordId: string;
    targetUserId?: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
};

export function ReportPanel({
                                module,
                                recordId,
                                targetUserId,
                                isOpen,
                                onClose,
                                onSuccess,
                            }: ReportPanelProps) {
    const [mounted, setMounted] = useState(false);
    const [reason, setReason] = useState<ReportReason>("spam");
    const [details, setDetails] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ensure portal only renders on the client after hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await submitReportAction({
                module,
                recordId,
                targetUserId,
                reason,
                details: details.trim() || undefined,
            });

            setDetails("");
            setReason("spam");
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit report.");
        } finally {
            setSubmitting(false);
        }
    }

    return createPortal(
        <div className={modalStyles.modalOverlay} onClick={onClose}>
            <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className={modalStyles.modalHeader}>
                    <div>
                        <span className={modalStyles.modalEyebrow}>Safety &amp; Moderation</span>
                        <h2 className={modalStyles.modalTitle}>Report Content</h2>
                    </div>
                    <button
                        type="button"
                        className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnGhost} ${modalStyles.modalCloseButton}`}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <div className={modalStyles.modalBody}>
                    <form onSubmit={handleSubmit} className={modalStyles.modalForm}>
                        {error && <div className={modalStyles.modalError}>{error}</div>}

                        <div className={formStyles.formField}>
                            <label htmlFor="reportReason" className={formStyles.formLabel}>
                                Reason for report
                            </label>
                            <select
                                id="reportReason"
                                className={formStyles.formInput}
                                value={reason}
                                onChange={(e) => setReason(e.target.value as ReportReason)}
                                disabled={submitting}
                            >
                                <option value="spam">Spam</option>
                                <option value="harassment">Harassment</option>
                                <option value="inappropriate_content">Inappropriate Content</option>
                                <option value="impersonation">Impersonation</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className={formStyles.formField}>
                            <label htmlFor="reportDetails" className={formStyles.formLabel}>
                                Additional Details (optional)
                            </label>
                            <textarea
                                id="reportDetails"
                                className={formStyles.formInput}
                                rows={3}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Explain why this content violates community standards..."
                                disabled={submitting}
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className={modalStyles.modalActions}>
                            <button
                                type="button"
                                className={`${buttonStyles.btn} ${buttonStyles.btnSecondary}`}
                                onClick={onClose}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}
                                disabled={submitting}
                            >
                                {submitting ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
}
