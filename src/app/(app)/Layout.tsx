import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/core/auth";
import { SignOutButton } from "@/core/auth/components/sign-out-button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div>
			<header>
				<p>Signed in as {session.user.email}</p>
			</header>
			<main>{children}</main>
		</div>
    );
}