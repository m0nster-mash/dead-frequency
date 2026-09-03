import styles from "@/feature/forum/styles/forum.module.css";
import Placeholder from "@shared/components/placeholder";

type PostContentAreaProps = {
    name?: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
};

export function PostContentArea({
                                    name = "body",
                                    placeholder = "Write your post...",
                                    defaultValue,
                                    required = true,
                                    disabled = false,
                                    rows = 8,
                                }: PostContentAreaProps) {

    return (
        <div className={styles.postContentArea}>
            <div className={styles.editorToolbar}>
                <div className={styles.editorToolbarPlaceholder}>
                    {/* TODO: Future Markdown / WYSIWYG controls */}
                    <Placeholder text={"FORMATTING_CONTROLS"}/>
                </div>
            </div>

            <textarea name={name}
                      className={styles.editor}
                      placeholder={placeholder}
                      defaultValue={defaultValue}
                      required={required}
                      disabled={disabled}
                      rows={rows}/>

            <div className={styles.editorFooter}>
                <span className={styles.editorFooterPlaceholder}>
                    <Placeholder text={"MARKDOWN_CONTROLS"}/>
                </span>

                <span className={styles.editorFooterPlaceholder}>
                    <Placeholder text={"ATTACHMENTS"}/>
                </span>

                <span className={styles.editorFooterPlaceholder}>
                    <Placeholder text={"PREVIEW"}/>
                </span>
            </div>
        </div>
    );
}
