import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";
import formStyles from "@/shared/styles/form.module.css";
import {JSX} from "react";

type CreateConversationPanelProps = {
    action: (formData: FormData) => void | Promise<void>;
    title?: string;
    submitLabel?: string;
};

/**
 * Panel for creating a new chatbox conversation.
 * Includes title, description, and submit button.
 */
export function CreateConversationPanel({
                                            action,
                                            title = "Start a Conversation",
                                            submitLabel = "Create",
                                        }: CreateConversationPanelProps): JSX.Element {
    return (
        <MainContentPanel title={title}>
            <form className={formStyles.form} action={action}>
                <div className={formStyles.formField}>
                    <label
                        htmlFor="conversation-title"
                        className={formStyles.formLabel}
                    >
                        Title
                    </label>

                    <input
                        id="conversation-title"
                        name="title"
                        type="text"
                        className={formStyles.formInput}
                        placeholder="What's this conversation about?"
                        maxLength={255}
                        required
                    />
                </div>

                <div className={formStyles.formField}>
                    <label
                        htmlFor="conversation-description"
                        className={formStyles.formLabel}
                    >
                        Description (Optional)
                    </label>

                    <textarea
                        id="conversation-description"
                        name="description"
                        className={chatboxStyles.descriptionInput}
                        placeholder="Add context or details about this conversation..."
                        maxLength={500}
                        rows={3}
                    />
                </div>

                <div className={formStyles.formActions}>
                    <button
                        type="submit"
                        className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}
                    >
                        {submitLabel}
                    </button>
                </div>
            </form>
        </MainContentPanel>
    );
}
