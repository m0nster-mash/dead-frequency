"use client";

import {authClient} from "@/core/auth/lib/auth-client";
import {useRouter} from "next/navigation";
import {JSX, SubmitEvent, useState} from "react";

/**
 * Properties for the AuthForm component.
 *
 * @property {"login" | "register"} mode - Controls whether the form processes an account login or user registration
 */
type AuthFormProps = {
    mode: "login" | "register";
}

/**
 * An interactive Client Component form that captures credentials and interfaces with the authentication client SDK.
 *
 * @param {AuthFormProps} props - The component properties
 *
 * @returns {JSX.Element} The visual baseline forms layout container
 */
export function AuthForm({mode}: AuthFormProps): JSX.Element {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * Intercepts standard browser forms submission processes. Evaluates data attributes and dispatches changes to
     * registration or validation endpoints.
     *
     * @param {SubmitEvent<HTMLFormElement>} event - Standard client submission event context.
     */
    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null); // Resets legacy tracking states before firing new transactions

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");
        const name = String(formData.get("name") || "");

        // Dispatches configuration parameters matching the current operational state signature
        const result = mode === "register" ?
            await authClient.signUp.email({name, email, password, callbackURL: "/dashboard"}) :
            await authClient.signIn.email({email, password, callbackURL: "/dashboard"});

        if (result.error) {
            setError(result.error.message || "Authentication failed");
            setLoading(false);
            return; // Stops trailing execution blocks if backend validations drop errors
        }

        // Shifts layout pathway focus into secure space grids
        router.push("/dashboard");
        router.refresh(); // Signals Next.js layout trees to flush client state buffers
    }

    return (
        <form onSubmit={handleSubmit}>
            {mode === "register" ? (
                <input required name="name" placeholder="Name" autoComplete="name"/>
            ) : null}

            <input required
                   type="email"
                   name="email"
                   placeholder="Email"
                   autoComplete="email"/>
            <input required
                   type="password"
                   name="password"
                   placeholder="Password"
                   autoComplete={mode === "register" ? "new-password" : "current-password"}/>

            <button type="submit" disabled={loading}>
                {loading ? "Please wait..." : mode === "register" ? "Create Account" : "Sign In"}
            </button>

            {error ? <p>{error}</p> : null}
        </form>
    );
}
