import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "dead-frequency",
    description: "go away",
};

export default function RootLayout({ children }: LayoutProps < "/" > ) {
    return (
        <html lang="en">
      <body>{children}</body>
    </html>
    );
}