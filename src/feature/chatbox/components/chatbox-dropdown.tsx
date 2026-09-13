"use client";

import {ChatboxPanel} from "@/feature/chatbox/components/chatbox-panel";
import buttonStyles from "@/shared/styles/buttons.module.css";
import dropdownStyles from "@/feature/chatbox/styles/chatbox.module.css";
import ChatIcon from "@/shared/svg/bootstrap-chat-icon.svg";
import {JSX, useState} from "react";

type ChatboxDropdownProps = {
    isAdmin?: boolean;
};

export function ChatboxDropdown({isAdmin = false}: ChatboxDropdownProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={dropdownStyles.dropdownWrapper}>
            <button type="button"
                    className={`${buttonStyles.iconBtn} ${buttonStyles.iconBtnFilled}`}
                    aria-label="ChatBox"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}>
                <ChatIcon/>
            </button>

            {isOpen && (
                <div className={dropdownStyles.dropdownMenu}>
                    <ChatboxPanel isAdmin={isAdmin}/>
                </div>
            )}
        </div>
    );
}
