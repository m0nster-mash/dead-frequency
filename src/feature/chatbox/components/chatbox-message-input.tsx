"use client";

import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";
import formStyles from "@/shared/styles/form.module.css";
import {JSX, useRef, useState} from "react";

type ChatboxMessageInputProps = {
    onSubmitAction: (formData: FormData) => Promise<void>;
    placeholder?: string;
    submitLabel?: string;
    maxLength?: number;
    disabled?: boolean;
};

/**
 * Form component for composing and submitting new chatbox messages.
 * Includes character count feedback and submit button.
 */
export function ChatboxMessageInput({
                                        onSubmitAction,
                                        placeholder = "Type a message... (mention users with @username)",
                                        submitLabel = "Send",
                                        maxLength = 5000,
                                        disabled = false,
                                    }: ChatboxMessageInputProps): JSX.Element {
    const [charCount, setCharCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            await onSubmitAction(formData);
            // Clear the textarea after successful submission
            if (textareaRef.current) {
                textareaRef.current.value = "";
                setCharCount(0);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className={chatboxStyles.messageInputForm} action={handleSubmit}>
            <div className={chatboxStyles.messageInputWrapper}>
                <textarea
                    ref={textareaRef}
                    name="body"
                    className={chatboxStyles.messageInput}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={disabled || isSubmitting}
                    onChange={handleChange}
                    rows={3}
                    required
                />

                <div className={chatboxStyles.messageInputFooter}>
                    <span className={chatboxStyles.charCounter}>
                        {charCount} / {maxLength}
                    </span>

                    <button
                        type="submit"
                        className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}
                        disabled={disabled || isSubmitting || charCount === 0}
                    >
                        {isSubmitting ? "Sending..." : submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}
