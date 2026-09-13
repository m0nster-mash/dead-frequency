"use client";

import chatboxStyles from "@/feature/chatbox/styles/chatbox.module.css";
import {JSX, useState} from "react";

type ChatboxInputProps = {
    error?: string | null;
    isLoading?: boolean;
    onSubmitAction: (body: string) => Promise<void>;
    placeholder?: string;
};

export function ChatboxInput({
                                 onSubmitAction,
                                 isLoading = false,
                                 error = null,
                                 placeholder = "Write a message...",
                             }: ChatboxInputProps): JSX.Element {
    const [body, setBody] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError(null);

        if (!body.trim()) {
            setLocalError("Message cannot be empty.");
            return;
        }

        try {
            await onSubmitAction(body);
            setBody(""); // Clear input on success
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to send message";
            setLocalError(message);
        }
    };

    const displayError = localError || error;

    return (
        <div className={chatboxStyles.inputContainer}>
            {displayError && (
                <div className={chatboxStyles.errorMessage}>
                    {displayError}
                </div>
            )}
            <form className={chatboxStyles.inputForm} onSubmit={handleSubmit}>
                <div className={chatboxStyles.inputFieldWrapper}>
                    <div className={chatboxStyles.inputArea}>
                        <textarea className={chatboxStyles.inputTextarea}
                                  name="body"
                                  placeholder={placeholder}
                                  value={body}
                                  onChange={(e) => setBody(e.target.value)}
                                  disabled={isLoading}
                                  rows={2}
                                  maxLength={250}/>
                        <div className={chatboxStyles.inputActions}>
                            <button type="submit"
                                    className={`${chatboxStyles.inputButton} ${chatboxStyles.inputButtonPrimary}`}
                                    disabled={isLoading || !body.trim()}>
                                {isLoading && <span className={chatboxStyles.loadingSpinner}/>}
                                {isLoading ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
