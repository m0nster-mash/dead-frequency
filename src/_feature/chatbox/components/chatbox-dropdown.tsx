"use client";

import {ChatboxPanel} from "@/_feature/chatbox/components/chatbox-panel";
import dropdownStyles from "@/_feature/chatbox/styles/chatbox.module.css";
import buttonStyles from "@/_shared/styles/buttons.module.css";
import ChatIcon from "@/_shared/svg/bootstrap-chat-icon.svg";
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
