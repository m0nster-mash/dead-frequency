import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PostContentArea} from "@/feature/forum/components/post-content-area";
import styles from "@/feature/forum/styles/forum.module.css";

/**
 * TODO:: clean up styles
 */
type CreatePostPanelProps = {
    action: (formData: FormData) => void | Promise<void>;
    title?: string;
    submitLabel?: string;
};

export function CreatePostPanel({
                                    action,
                                    title = "Create Thread",
                                    submitLabel = "Post Thread",
                                }: CreatePostPanelProps) {
    return (
        <MainContentPanel title={title}>
            <form className={styles.postForm}
                  action={action}>
                <div className={styles.field}>
                    <label htmlFor="thread-title"
                           className={styles.label}>
                        Topic
                    </label>

                    <input id="thread-title"
                           name="title"
                           className={styles.input}
                           placeholder="Enter a topic..."
                           required/>
                </div>

                <div className={styles.field}>
                    <label htmlFor="thread-body"
                           className={styles.label}>
                        Post
                    </label>
                    <PostContentArea name="body" placeholder="Write your opening post..."/>
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
