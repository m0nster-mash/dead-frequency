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
                <div>
                    {session?.user
                        ? (<DashboardPage/>)
                        : (<AuthCard initialMode="register"/>)}
                </div>
            </SessionLayout>
        </main>
    );
}