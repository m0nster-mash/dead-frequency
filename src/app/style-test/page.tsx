"use client";

import { useState } from "react";

export default function ColorTestPage() {
    const [checked, setChecked] = useState(true);
    const [selected, setSelected] = useState("static");
    const [range, setRange] = useState(65);
    const [toggle, setToggle] = useState(true);

    return (
        <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
            <div className="mx-auto max-w-7xl px-6 py-12">
                {/* Header */}
                <header className="mb-12">
                    <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[var(--color-primary)]">
                        Signal 01 / Color Test
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-strong)]">
                        CRT Horror Interface
                    </h1>

                    <p className="mt-3 max-w-2xl text-[var(--color-text-muted)]">
                        A visual test page for the semantic colour system.
                        Interact with every control to inspect hover, focus,
                        active, disabled, danger, and surface states.
                    </p>
                </header>

                <div className="space-y-8">
                    {/* =================================================================
                        Surfaces
                    ================================================================== */}
                    <section>
                        <SectionHeading
                            eyebrow="01"
                            title="Surfaces"
                            description="Background, surface, raised surface, and border hierarchy."
                        />

                        <div className="grid gap-4 md:grid-cols-3">
                            <SurfaceCard title="Background">
                                <p className="text-[var(--color-text-muted)]">
                                    Primary page background.
                                </p>
                            </SurfaceCard>

                            <div className="rounded-[var(--form-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                                <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                    Surface
                                </p>
                                <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
                                    Standard Surface
                                </h3>
                                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                                    Used for cards, panels, and form groups.
                                </p>
                            </div>

                            <div className="rounded-[var(--form-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-6">
                                <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-primary)]">
                                    Raised
                                </p>
                                <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">
                                    Raised Surface
                                </h3>
                                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                                    Higher visual elevation.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* =================================================================
                        Typography
                    ================================================================== */}
                    <section>
                        <SectionHeading
                            eyebrow="02"
                            title="Typography"
                            description="Text, muted, disabled, and primary content."
                        />

                        <div className="rounded-[var(--form-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                        Strong
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-[var(--color-text-strong)]">
                                        LOST SIGNAL
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                        Normal
                                    </p>
                                    <p className="mt-1 text-[var(--color-text)]">
                                        The signal appears to be originating from
                                        somewhere beneath the building.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                        Muted
                                    </p>
                                    <p className="mt-1 text-[var(--color-text-muted)]">
                                        Transmission received 00:13:42 ago.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                        Disabled
                                    </p>
                                    <p className="mt-1 text-[var(--color-text-disabled)]">
                                        Archived transmission unavailable.
                                    </p>
                                </div>

                                <div className="border-t border-[var(--color-border-subtle)] pt-5">
                                    <a
                                        href="#"
                                        className="text-[var(--color-primary)] underline-offset-4 hover:text-[var(--color-primary-hover)] hover:underline"
                                    >
                                        Inspect transmission →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =================================================================
                        Buttons
                    ================================================================== */}
                    <section>
                        <SectionHeading
                            eyebrow="03"
                            title="Buttons"
                            description="Primary, secondary, danger, disabled, and focus states."
                        />

                        <div className="rounded-[var(--form-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                            <div className="flex flex-wrap gap-3">
                                <button className="rounded-[var(--form-radius)] bg-[var(--color-primary)] px-5 py-2.5 font-semibold text-[var(--color-on-primary)] transition hover:bg-[var(--color-primary-hover)] focus-visible:shadow-[var(--ring-focus)]">
                                    Restore Signal
                                </button>

                                <button className="rounded-[var(--form-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-5 py-2.5 font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-visible:shadow-[var(--ring-focus)]">
                                    Inspect
                                </button>

                                <button className="rounded-[var(--form-radius)] border border-[var(--color-danger)] bg-[var(--color-danger-muted)] px-5 py-2.5 font-semibold text-[var(--color-danger-hover)] transition hover:bg-[var(--color-danger)] hover:text-[var(--color-on-danger)] focus-visible:shadow-[var(--ring-focus)]">
                                    Destroy
                                </button>

                                <button
                                    disabled
                                    className="cursor-not-allowed rounded-[var(--form-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 font-semibold text-[var(--color-text-disabled)]"
                                >
                                    Unavailable
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* =================================================================
                        Forms
                    ================================================================== */}
                    <section>
                        <SectionHeading
                            eyebrow="04"
                            title="Form Controls"
                            description="Inputs, selects, textareas, checkboxes, radios, range, and toggles."
                        />

                        <div className="rounded-[var(--form-radius)] border border-[var(--color-border)] bg-[var(--form-surface)] p-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Field label="Transmission ID">
                                    <input
                                        type="text"
                                        placeholder="e.g. TR-0091"
                                        className="form-control"
                                    />
                                </Field>

                                <Field label="Frequency">
                                    <input
                                        type="number"
                                        defaultValue={104.7}
                                        className="form-control"
                                    />
                                </Field>

                                <Field label="Password">
                                    <input
                                        type="password"
                                        defaultValue="something-secret"
                                        className="form-control"
                                    />
                                </Field>

                                <Field label="Source">
                                    <select
                                        value={selected}
                                        onChange={(e) => setSelected(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="static">Static</option>
                                        <option value="basement">Basement</option>
                                        <option value="unknown">Unknown</option>
                                    </select>
                                </Field>

                                <div className="md:col-span-2">
                                    <Field label="Transmission">
                                        <textarea
                                            rows={5}
                                            defaultValue={
                                                "I can hear someone breathing between the static."
                                            }
                                            className="form-control resize-y"
                                        />
                                    </Field>
                                </div>

                                <div className="md:col-span-2">
                                    <Field label="Signal strength">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={range}
                                                onChange={(e) =>
                                                    setRange(Number(e.target.value))
                                                }
                                                className="h-2 w-full accent-[var(--color-primary)]"
                                            />
                                            <span className="w-12 text-right font-mono text-sm text-[var(--color-primary)]">
                                                {range}%
                                            </span>
                                        </div>
                                    </Field>
                                </div>

                                <div className="space-y-4">
                                    <p className="form-label">Detection mode</p>

                                    <label className="form-option">
                                        <input
                                            type="radio"
                                            name="mode"
                                            defaultChecked
                                        />
                                        <span>Automatic</span>
                                    </label>

                                    <label className="form-option">
                                        <input
                                            type="radio"
                                            name="mode"
                                        />
                                        <span>Manual</span>
                                    </label>

                                    <label className="form-option">
                                        <input
                                            type="radio"
                                            name="mode"
                                        />
                                        <span>Continuous</span>
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    <p className="form-label">Options</p>

                                    <label className="form-option">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) =>
                                                setChecked(e.target.checked)
                                            }
                                        />
                                        <span>Record transmission</span>
                                    </label>

                                    <label className="form-option">
                                        <input type="checkbox" />
                                        <span>Enhance static</span>
                                    </label>

                                    <label className="form-option">
                                        <input type="checkbox" disabled />
                                        <span>Neural reconstruction</span>
                                    </label>
                                </div>

                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between rounded-[var(--form-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                                        <div>
                                            <p className="font-medium text-[var(--color-text)]">
                                                Live monitoring
                                            </p>
                                            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                                                Continue listening while the application
                                                is minimized.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setToggle(!toggle)}
                                            aria-pressed={toggle}
                                            className={`relative h-6 w-11 rounded-full transition ${
                                                toggle
                                                    ? "bg-[var(--color-primary)]"
                                                    : "bg-[var(--color-surface-raised)]"
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full bg-[var(--color-text-strong)] transition ${
                                                    toggle
                                                        ? "left-6"
                                                        : "left-1"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =================================================================
                        States
                    ================================================================== */}
                    <section>
                        <SectionHeading
                            eyebrow="05"
                            title="Input States"
                            description="Normal, focused, invalid, and disabled controls."
                        />

                        <div className="grid gap-6 md:grid-cols-2">
                            <Field label="Normal">
                                <input
                                    className="form-control"
                                    placeholder="Normal input"
                                />
                            </Field>

                            <Field label="Focus">
                                <input
                                    autoFocus
                                    className="form-control"
                                    placeholder="Focused input"
                                />
                            </Field>

                            <Field
                                label="Invalid"
                                hint="The transmission ID could not be verified."
                                danger
                            >
                                <input
                                    className="form-control form-control-danger"
                                    defaultValue="UNKNOWN-000"
                                />
                            </Field>

                            <Field label="Disabled">
                                <input
                                    disabled
                                    className="form-control"
                                    defaultValue="SYSTEM LOCKED"
                                />
                            </Field>
                        </div>
                    </section>

                    {/* =================================================================
                        Status
                    ================================================================== */}
                    <section>
                        <SectionHeading
                            eyebrow="06"
                            title="Status"
                            description="Primary and danger messaging."
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <Status
                                type="success"
                                title="Signal acquired"
                                message="A stable carrier has been detected."
                            />

                            <Status
                                type="danger"
                                title="Unknown transmission"
                                message="The received signal does not match any known source."
                            />
                        </div>
                    </section>

                    {/* =================================================================
                        Cards / Elevation
                    ================================================================== */}
                    <section>
                        <SectionHeading
                            eyebrow="07"
                            title="Elevation"
                            description="Borders and shadow hierarchy."
                        />

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="rounded-[var(--form-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
                                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                    Shadow SM
                                </p>
                                <p className="mt-3 text-[var(--color-text)]">
                                    Minor elevation.
                                </p>
                            </div>

                            <div className="rounded-[var(--form-radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)]">
                                <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                    Shadow MD
                                </p>
                                <p className="mt-3 text-[var(--color-text)]">
                                    Medium elevation.
                                </p>
                            </div>

                            <div className="rounded-[var(--form-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-lg)]">
                                <p className="text-xs uppercase tracking-widest text-[var(--color-primary)]">
                                    Shadow LG
                                </p>
                                <p className="mt-3 text-[var(--color-text)]">
                                    Maximum elevation.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* =================================================================
                        Footer
                    ================================================================== */}
                    <footer className="border-t border-[var(--color-border-subtle)] pt-8">
                        <div className="flex flex-col justify-between gap-3 text-sm md:flex-row">
                            <p className="text-[var(--color-text-muted)]">
                                SIGNAL STATUS:{" "}
                                <span className="text-[var(--color-primary)]">
                                    NOMINAL
                                </span>
                            </p>

                            <p className="font-mono text-[var(--color-text-disabled)]">
                                00:13:42 / CHANNEL 07
                            </p>
                        </div>
                    </footer>
                </div>
            </div>

            <style jsx>{`
                .form-control {
                    width: 100%;
                    border: 1px solid var(--form-border);
                    border-radius: var(--form-radius);
                    background: var(--form-background);
                    color: var(--form-text);
                    padding: 0.7rem 0.8rem;
                    transition: var(--form-transition);
                }

                .form-control::placeholder {
                    color: var(--form-placeholder);
                }

                .form-control:hover {
                    border-color: var(--form-border-hover);
                }

                .form-control:focus {
                    outline: none;
                    border-color: var(--form-accent);
                    box-shadow: var(--color-primary);
                }

                .form-control:disabled {
                    cursor: not-allowed;
                    opacity: 0.5;
                }

                .form-control-danger {
                    border-color: var(--form-danger);
                }

                .form-control-danger:focus {
                    border-color: var(--form-danger);
                    box-shadow: 0 0 0 3px var(--form-danger-muted);
                }

                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--form-label);
                }

                .form-option {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    color: var(--form-text);
                    cursor: pointer;
                }

                .form-option input {
                    width: 1rem;
                    height: 1rem;
                    accent-color: var(--form-accent);
                }
            `}</style>
        </main>
    );
}

function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div className="mb-5">
            <p className="mb-1 font-mono text-xs tracking-[0.25em] text-[var(--color-primary)]">
                {eyebrow}
            </p>
            <h2 className="text-2xl font-bold text-[var(--color-text-strong)]">
                {title}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {description}
            </p>
        </div>
    );
}

function SurfaceCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-[var(--form-radius)] border border-[var(--color-border)] bg-[var(--color-background)] p-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                {title}
            </p>
            {children}
        </div>
    );
}

function Field({
    label,
    hint,
    danger = false,
    children,
}: {
    label: string;
    hint ? : string;
    danger ? : boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="form-label">{label}</label>
            {children}

            {hint && (
                <p
                    className={`mt-2 text-xs ${
                        danger
                            ? "text-[var(--color-danger)]"
                            : "text-[var(--color-text-muted)]"
                    }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
}

function Status({
    type,
    title,
    message,
}: {
    type: "success" | "danger";
    title: string;
    message: string;
}) {
    const danger = type === "danger";

    return (
        <div
            className={`rounded-[var(--form-radius)] border p-5 ${
                danger
                    ? "border-[var(--color-danger)] bg-[var(--color-danger-muted)]"
                    : "border-[var(--color-primary)] bg-[var(--color-primary-muted)]"
            }`}
        >
            <div className="flex items-start gap-3">
                <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        danger
                            ? "bg-[var(--color-danger)]"
                            : "bg-[var(--color-primary)]"
                    }`}
                />

                <div>
                    <h3
                        className={`font-semibold ${
                            danger
                                ? "text-[var(--color-danger-hover)]"
                                : "text-[var(--color-primary-hover)]"
                        }`}
                    >
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
}