"use client";

import {ChatboxPanel} from "@/feature/chatbox/components/chatbox-panel";
import buttonStyles from "@/shared/styles/buttons.module.css";
import ChatIcon from "@/shared/svg/bootstrap-chat-icon.svg";
import {JSX, useState} from "react";

type ChatboxDropdownProps = {
    isAdmin?: boolean;
};

export function ChatboxDropdown({isAdmin = false}: ChatboxDropdownProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{position: "relative"}}>
            <button type="button"
                    className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled}`}
                    aria-label="ChatBox"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}>
                <ChatIcon/>
            </button>

            {isOpen && (
                <div style={{
                    position: "absolute",
                    top: "calc(100% + 0.5rem)",
                    right: 0,
                    width: "360px",
                    maxWidth: "90vw",
                    zIndex: 100,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    borderRadius: "var(--radius-sm, 8px)",
                }}>
                    <ChatboxPanel isAdmin={isAdmin}/>
                </div>
            )}
        </div>
    );
}
