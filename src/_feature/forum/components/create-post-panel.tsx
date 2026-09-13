import {MainContentPanel} from "@/_core/dashboard/components/panels/main-card";
import {PostContentArea} from "@/_feature/forum/components/post-content-area";
import forumStyles from "@/_feature/forum/styles/forum.module.css";
import buttonStyles from "@/_shared/styles/buttons.module.css";
import formStyles from "@/_shared/styles/form.module.css";

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
            <form className={forumStyles.postForm}
                  action={action}>
                <div className={formStyles.field}>
                    <label htmlFor="thread-title"
                           className={formStyles.formLabel}>
                        Topic
                    </label>

                    <input id="thread-title"
                           name="title"
                           className={formStyles.formInput}
                           placeholder="Enter a topic..."
                           required/>
                </div>

                <div className={formStyles.field}>
                    <label htmlFor="thread-body"
                           className={formStyles.formLabel}>
                        Post
                    </label>
                    <PostContentArea name="body" placeholder="Write your opening post..."/>
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
