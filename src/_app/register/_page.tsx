import {AuthCard} from "@/_core/auth";
import {JSX} from "react";

/**
 * The primary gateway for user registration
 *
 * @returns {JSX.Element} The baseline layout container rendering the user registration card interface.
 */
export default function RegisterPage(): JSX.Element {
    return (
        <AuthCard initialMode="register"/>
    );
}
