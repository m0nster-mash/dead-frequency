import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/core/auth";
import { SignOutButton } from "@/core/auth/components/sign-out-button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session ? .user) {
        redirect("/login");
    }

    return (
        <div>
			<header>
				<h1>This is the logged in screen that should appear on every logged in page.</h1>
				<p>Signed in as {session.user.email}</p>
				 <div>
                	<Link href="/styletest">Click here to see the style test page.</Link>
            	</div>
				<SignOutButton />
			</header>
			<main>{children}</main>
		</div>
    );
}