import {headers} from "next/headers";
import {auth} from "@/core/auth";
import {AuthCard} from "@/core/auth";
import DashboardPage from "./dashboard/page";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <main>
            <h1 className="go-away">go away</h1>
            <div>
                {session?.user
                    ? (<DashboardPage/>)
                    : (<AuthCard initialMode="register"/>)}
            </div>
        </main>
    );
}