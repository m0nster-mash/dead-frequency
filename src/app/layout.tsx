import type {Metadata} from "next";
import "./globals.css";
import Header from "@/shared/components/layout/header";
import Footer from "@/shared/components/layout/footer";
import Sidebar from "@/shared/components/layout/sidebar";

export const metadata: Metadata = {
    title: "dead-frequency",
    description: "go away",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html lang="en">
        <body>
        <div className="app-shell">
            <Header/>
            <div className="app-body">
                <Sidebar/>
                <main className="app-content">
                    {children}
                </main>
            </div>
            <Footer/>
        </div>
        </body>
        </html>
    );
}