"use client";

import {SubmitEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {authClient} from "@/core/auth/lib/auth-client";
import "@/shared/styles/forms.css";
import styles from "./auth-card.module.css";

type Mode = "login" | "register";
type AuthCardProps = { initialMode?: Mode; };

export function AuthCard({initialMode = "login"}: AuthCardProps) {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>(initialMode);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function switchMode(next: Mode) {
        if (next === mode) {
            return;
        }
        setMode(next);
        setError(null);
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");
        const name = String(formData.get("name") || "");

        const result =
            mode === "register" ?
                await authClient.signUp.email({name, email, password, callbackURL: "/dashboard",}) :
                await authClient.signIn.email({email, password, callbackURL: "/dashboard",});

        if (result.error) {
            setError(result.error.message || "Authentication failed");
            setLoading(false);
            return;
        }
        router.push("/dashboard");
        router.refresh();
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.brand}>
                    <div className={styles.brandTitle}>Dead Frequency</div>
                    <div className={styles.brandSubtitle}>
                        {mode === "login" ? "Welcome back, sign in to continue" : "Create an account to get started"}
                    </div>
                </div>

                <div className={styles.tabs} role="tablist" aria-label="Authentication mode">
                    <button type="button"
                            role="tab"
                            aria-selected={mode === "login"}
                            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
                            onClick={() => switchMode("login")}>
                        Sign in
                    </button>
                    <button type="button"
                            role="tab"
                            aria-selected={mode === "register"}
                            className={`${styles.tab} ${mode === "register" ? styles.tabActive : ""}`}
                            onClick={() => switchMode("register")}>
                        Register
                    </button>
                </div>

                <form className="form" onSubmit={handleSubmit} key={mode}>
                    {mode === "register" ? (
                        <div className="form-field">
                            <label className="form-label" htmlFor="name"> Name </label>
                            <input id="name"
                                   required
                                   name="name"
                                   placeholder="Jane Doe"
                                   autoComplete="name"
                                   className="form-input"/>
                        </div>
                    ) : null}

                    <div className="form-field">
                        <label className="form-label" htmlFor="email"> Email </label>
                        <input id="email"
                               required
                               type="email"
                               name="email"
                               placeholder="you@example.com"
                               autoComplete="email"
                               className="form-input"/>
                    </div>

                    <div className="form-field">
                        <label className="form-label" htmlFor="password"> Password </label>
                        <input id="password"
                               required
                               type="password"
                               name="password"
                               placeholder="••••••••"
                               autoComplete={mode === "register" ? "new-password" : "current-password"}
                               className="form-input"/>
                    </div>

                    {error ? <p className="form-error">{error}</p> : null}

                    <button type="submit" disabled={loading} className="form-submit">
                        {loading ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}
                    </button>
                </form>

                <p className={styles.footer}>
                    {mode === "login" ? (
                        <span>
                            Need an account?{" "}
                            <span className={styles.footerLink} onClick={() => switchMode("register")}>
                                Register
                            </span>
                        </span>
                    ) : (
                        <span>
                            Already have an account?{" "}
                            <span className={styles.footerLink} onClick={() => switchMode("login")}>
                                Sign in
                            </span>
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}