import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/core/dashboard/components/app-shell";

export const metadata: Metadata = {
    title: "dead-frequency",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en">
        <body>
        <AppShell>{children}</AppShell>
        </body>
        </html>
    );
}