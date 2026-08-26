import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/core/auth";

export default async function GuestLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        header: await header()
    });

    if (session ? .user) {
        redirect("/dashboard");
    }

    return (
        <div>
        	<h1>This is the guest layout that should appear on every guest page.</h1>
        	<div>{children}</div>
    	</div>
    );
}