import styles from "@/feature/forum/styles/forum.module.css";

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
                    {/* Future Markdown / WYSIWYG controls */}
                    [FORMATTING_CONTROLS]
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
                    [MARKDOWN_CONTROLS]
                </span>

                <span className={styles.editorFooterPlaceholder}>
                    [ATTACHMENTS]
                </span>

                <span className={styles.editorFooterPlaceholder}>
                    [PREVIEW]
                </span>
            </div>
        </div>
    );
}
