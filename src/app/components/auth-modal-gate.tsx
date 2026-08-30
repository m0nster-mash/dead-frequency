"use client";

import {useRouter, useSearchParams} from "next/navigation";
import Modal from "@/core/auth/components/login-modal";
import {AuthCard} from "@core/auth";

export default function AuthModalGate() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const authModal = searchParams.get("authModal");
    const authType = authModal === "register" ? "register" : "login";

    if (!authModal) {
        return null;
    }

    const close = () => {
        router.replace("/", {scroll: false});
    };

    return (
        <Modal onClose={close}>
            <AuthCard initialMode={authType}/>
        </Modal>
    );
}