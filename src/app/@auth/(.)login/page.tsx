import {AuthCard} from "@core/auth";
import Modal from "@/core/auth/components/login-modal";

export default function LoginModal() {
    return (
        <Modal>
            <AuthCard/>
        </Modal>
    );
}