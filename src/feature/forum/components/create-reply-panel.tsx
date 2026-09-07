import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PostContentArea} from "@/feature/forum/components/post-content-area";
import styles from "@/feature/forum/styles/forum.module.css";

/**
 * TODO:: clean up styles
 */
type CreateReplyPanelProps = {
    action: (formData: FormData) => void | Promise<void>;
    title?: string;
    submitLabel?: string;
};

export function CreateReplyPanel({
                                     action,
                                     title = "Post Reply",
                                     submitLabel = "Post Reply",
                                 }: CreateReplyPanelProps) {
    return (
        <MainContentPanel title={title}>
            <form className={styles.postForm}
                  action={action}>
                <div className={styles.field}>
                    <label htmlFor="reply-body"
                           className={styles.label}>
                        Reply
                    </label>
                    <PostContentArea name="body" placeholder="Write your reply..."/>
                </div>

                <div className={styles.postFormActions}>
                    <button type="submit"
                            className={styles.submit}>
                        {submitLabel}
                    </button>
                </div>
            </form>
        </MainContentPanel>
    );
}
