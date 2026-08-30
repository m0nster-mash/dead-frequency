"use client";

import {SubmitEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {authClient} from "@/core/auth/lib/auth-client";
// import "@/shared/styles/forms.css";

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
        <div>
            <div>
                <div>Dead Frequency</div>
                <div>
                    {mode === "login" ? "Sign in to continue" : "Create an account to get started"}
                </div>
            </div>

            <div role="tablist" aria-label="Authentication mode">
                <button type="button" role="tab" onClick={() => switchMode("login")}>
                    Sign in
                </button>
                <button type="button" role="tab" onClick={() => switchMode("register")}>
                    Register
                </button>
            </div>
            <form onSubmit={handleSubmit} key={mode}>
                {mode === "register" ? (
                    <div>
                        <label htmlFor="name">
                            Name
                        </label>
                        <input id="name" type={"text"} required name="name" placeholder="Jane Doe" autoComplete="name"/>
                    </div>
                ) : null}

                <div>
                    <label htmlFor="email">
                        Emails
                    </label>
                    <input id="email" required type="email" name="email" placeholder="you@example.com"
                           autoComplete="email"/>
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>
                    <input id="password" required type="password" name="password" placeholder="••••••••"
                           autoComplete={mode === "register" ? "new-password" : "current-password"}/>
                </div>
                {error ? <p>{error}</p> : null}
                <button type="submit" disabled={loading}>
                    {loading ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}
                </button>
            </form>
            <p>
                {mode === "login" ? (
                    <span>
	        			Need an account?
	        			<span onClick={() => switchMode("register")}>
	        				Register
	        			</span>
	        		</span>
                ) : (
                    <span>
	        			Already have an account?
	        			<span onClick={() => switchMode("login")}>
	        				Sign in
	        			</span>
	        		</span>
                )}
            </p>
        </div>
    );
}