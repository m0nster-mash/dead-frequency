import {AuthCard} from "@/core/auth";
import {JSX} from "react";

/**
 * The primary gateway for user authentication
 *
 * @returns {JSX.Element} The baseline layout container rendering the user login card interface.
 */
export default function LoginPage(): JSX.Element {
    return (
        <AuthCard initialMode="login"/>
    );
}
