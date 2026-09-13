import {AuthCard} from "@/core/auth/components/auth-card";
import {JSX} from "react";

/**
 * The primary gateway for user registration
 */
export default function RegisterPage(): JSX.Element {
    return (
        <AuthCard initialMode="register"/>
    );
}
