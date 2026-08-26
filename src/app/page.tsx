import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/core/auth";
import { AuthCard } from "@/core/auth";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <main>
            <h1>go away</h1>
            {session?.user ? (
                <div>
                    <p>Signed in as {session.user.email}</p>
                </div>
            ) : (
                <div>
                    <AuthCard initialMode="register"/>
                </div>
            )}
        </main>
    );
}