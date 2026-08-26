import Link from "next/link";
import {headers} from "next/headers";
import {auth} from "@/core/auth";
import {AuthCard} from "@/core/auth";
import DashboardPage from "@/app/(user)/dashboard/page";
import SessionLayout from "@/app/components/session-layout";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <main>
            <SessionLayout>
                <h1>go away</h1>
                <div>
                    {session?.user
                        ? (<DashboardPage/>)
                        : (<AuthCard initialMode="register"/>)}
                </div>
                <div>
                    <Link href="/styletest">Click here to see the style test page.</Link>
                </div>
            </SessionLayout>
        </main>
    );
}