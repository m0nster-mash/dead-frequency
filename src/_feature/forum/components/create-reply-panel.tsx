import {MainContentPanel} from "@/_core/dashboard/components/panels/main-card";
import {PostContentArea} from "@/_feature/forum/components/post-content-area";
import forumStyles from "@/_feature/forum/styles/forum.module.css";
import buttonStyles from "@/_shared/styles/buttons.module.css";
import formStyles from "@/_shared/styles/form.module.css";

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
            <form className={forumStyles.postForm}
                  action={action}>
                <div className={formStyles.field}>
                    <label htmlFor="reply-body"
                           className={formStyles.formLabel}>
                        Reply
                    </label>
                    <PostContentArea name="body" placeholder="Write your reply..."/>
                </div>

                <div className={forumStyles.postFormActions}>
                    <button type="submit"
                            className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}>
                        {submitLabel}
                    </button>
                </div>
            </form>
        </MainContentPanel>
    );
}
