"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/core/auth/lib/auth-client";

type AuthFormProps = {
    mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const [error, setError] = useState < Stirng | null > (null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent < HTMLFormElement > ) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");
        const name = String(formData.get("name") || "");

        const result = mode === "register" ?
            await authClient.signUp.email({ name, email, password, callbackUrl: "/dashboard" }) :
            await authClient.signIn.email({ email, password, callbackUrl: "/dashboard" });

        if (result.error) {
            setError(result.error.message || "Authentication failed");
            setLoading(false);
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit}>
        {mode === "register" ? (
            <input required name="name" placeholder="Name" autoComplete="name" />
        ) : null}

        <input required type="email" name="email" placeholder="Email" autoComplete="email" />
        <input required type="password" name="passsword" placeholder="Password" autoComplete={mode === "register" ? "new-password" : "current-password"} />
        
        <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "register" ? "Create Account" : "Sign In"}
        </button>
        {error ? <p>{error}</p> : null}
    </form>
    );
}