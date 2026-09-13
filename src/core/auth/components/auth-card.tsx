"use client";

import {authClient} from "@/_core/auth/lib/auth-client";
import brandStyles from "@/shared/styles/brand.module.css";
import buttonStyles from "@/shared/styles/buttons.module.css";
import formStyles from "@/shared/styles/form.module.css";
import panelStyles from "@/shared/styles/panel.module.css";
import tabStyles from "@/shared/styles/patterns/tabs.module.css";
import {useRouter} from "next/navigation";
import {JSX, SubmitEvent, useState} from "react";

/**
 * Valid operational state modes for the authentication workflow.
 */
type Mode = "login" | "register";

/**
 * Properties for the AuthCard component.
 *
 * @property {Mode} [initialMode="login"] - The initial visual state mode to render on initial paint.
 */
type AuthCardProps = {
    initialMode?: Mode;
};

/**
 * An interactive Client Component card handling credentials submission, registration parsing, and portal navigation.
 *
 * @param {AuthCardProps} props - The component properties.
 *
 * @returns {JSX.Element} The visual user authentication card dashboard block.
 */
export function AuthCard({initialMode = "login"}: AuthCardProps): JSX.Element {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>(initialMode);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * Swaps the visual form visibility mode and flushes legacy error traces out of view buffers.
     *
     * @param {Mode} next - The target mode configuration state to switch to.
     */
    function switchMode(next: Mode) {
        if (next === mode) {
            return;
        }
        setMode(next);
        setError(null);
    }

    /**
     * Intercepts standard browser forms submission processes. Dispatches verification signatures or handles
     * registration requests utilizing the client SDK layer.
     *
     * @param {SubmitEvent<HTMLFormElement>} event - Standard client submission event context
     */
    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");
        const name = String(formData.get("name") || "");

        // selects matching endpoint strategy signatures mapping user view states
        const result =
            mode === "register" ?
                await authClient.signUp.email({name, email, password, callbackURL: "/dashboard"}) :
                await authClient.signIn.email({email, password, callbackURL: "/dashboard"});

        if (result.error) {
            setError(result.error.message || "Authentication failed");
            setLoading(false);
            return;
        }

        // relocates current visitor path tracking pointers inside workspace modules
        router.push("/dashboard");
        router.refresh(); // flushes server data caches and updates structural layouts with dynamic session records
    }

    return (
        <div className={panelStyles.panelViewport}>
            <div className={`${panelStyles.panel} ${panelStyles.panelConstrained} ${panelStyles.panelElevated}`}>
                <div className={panelStyles.panelBody}>
                    <div style={{marginBottom: "var(--size-space-6)"}}>
                        <div className={brandStyles.brandLarge}>Dead Frequency</div>
                        <div style={{
                            marginTop: "var(--size-space-2)",
                            color: "var(--color-text-muted)",
                            fontSize: "var(--font-size-sm)"
                        }}>
                            {mode === "login" ? "Sign in to continue" : "Create an account to get started"}
                        </div>
                    </div>

                    <div className={tabStyles.tabs} role="tablist" aria-label="Authentication mode"
                         style={{marginBottom: "var(--size-space-6)"}}>
                        <button type="button"
                                role="tab"
                                aria-selected={mode === "login"}
                                className={mode === "login" ? `${tabStyles.tab} ${tabStyles.tabActive}` : tabStyles.tab}
                                onClick={() => switchMode("login")}>
                            Sign in
                        </button>
                        <button type="button"
                                role="tab"
                                aria-selected={mode === "register"}
                                className={mode === "register" ? `${tabStyles.tab} ${tabStyles.tabActive}` : tabStyles.tab}
                                onClick={() => switchMode("register")}>
                            Register
                        </button>
                    </div>

                    <form className={formStyles.form} onSubmit={handleSubmit} key={mode}>
                        {mode === "register" ? (
                            <div className={formStyles.formField}>
                                <label className={formStyles.formLabel} htmlFor="name">
                                    Name
                                </label>
                                <input id="name"
                                       className={formStyles.formInput}
                                       type="text"
                                       required
                                       name="name"
                                       placeholder="Jane Doe"
                                       autoComplete="name"/>
                            </div>
                        ) : null}

                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel} htmlFor="email">
                                Email
                            </label>
                            <input id="email"
                                   className={formStyles.formInput}
                                   required
                                   type="email"
                                   name="email"
                                   placeholder="you@example.com"
                                   autoComplete="email"/>
                        </div>

                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel} htmlFor="password">
                                Password
                            </label>
                            <input id="password"
                                   className={formStyles.formInput}
                                   required
                                   type="password"
                                   name="password"
                                   placeholder="••••••••"
                                   autoComplete={mode === "register" ? "new-password" : "current-password"}/>
                        </div>

                        {error ? <p className={formStyles.formError}>{error}</p> : null}

                        <button className={buttonStyles.btn} type="submit" disabled={loading}>
                            {loading ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}
                        </button>
                    </form>

                    <p style={{
                        marginTop: "var(--size-space-6)",
                        textAlign: "center",
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-muted)"
                    }}>
                        {mode === "login" ? (
                            <span>
                                Need an account?{" "}
                                <span style={{
                                    marginLeft: "var(--size-space-1)",
                                    color: "var(--color-action-primary)",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }} onClick={() => switchMode("register")}>
                                    Register
                                </span>
                            </span>
                        ) : (
                            <span>
                                Already have an account?{" "}
                                <span style={{
                                    marginLeft: "var(--size-space-1)",
                                    color: "var(--color-action-primary)",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }} onClick={() => switchMode("login")}>
                                    Sign in
                                </span>
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
