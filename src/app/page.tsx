import {headers} from "next/headers";
import {auth} from "@/core/auth";
import DashboardPage from "./dashboard/page";
import HomePage from "@/app/home/page";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <main>
            <div>
                {session?.user
                    ? (<DashboardPage/>)
                    : (<HomePage/>)}
            </div>
        </main>
    );
}