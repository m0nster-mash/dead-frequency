import {AuthCard} from "@core/auth";
import Modal from "@/core/auth/components/login-modal";
import { useRouter } from "next/navigation";

export default function RegisterModal() {
  const router = useRouter();
  return (
    <Modal onClose={() => router.back()}>
      <AuthCard />
    </Modal>
  );
}