import SessionLayout from "@/app/components/session-layout";
import React from "react";

export default function AgnosticLayout({children}: { children: React.ReactNode }) {
    return <SessionLayout>{children}</SessionLayout>;
}