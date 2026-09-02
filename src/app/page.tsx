import HomePage from "@/app/home/page";
import {auth} from "@/core/auth";
import {headers} from "next/headers";
import {JSX} from "react";
import DashboardPage from "./dashboard/page";

/**
 * The root entry conditional router for the application.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the correct contextual landing viewport component stream
 */
export default async function Home(): Promise<JSX.Element> {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <main>
            <div>
                {/*
                   Server-side routing gate: Evaluates identity parameters before rendering chunks
                   to ensure clean separation between secure operational tools and landing sites.
                */}
                {session?.user
                    ? (<DashboardPage/>)
                    : (<HomePage/>)}
            </div>
        </main>
    );
}
