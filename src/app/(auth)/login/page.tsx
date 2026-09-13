import {AuthCard} from "@/core/auth/components/auth-card";
import {JSX} from "react";

/**
 * The primary gateway for user authentication
 */
export default function LoginPage(): JSX.Element {
    return (
        <AuthCard initialMode="login"/>
    );
}
