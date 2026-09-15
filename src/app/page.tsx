import HomePage from "@/app/home/page";
import {requireSession} from "@/core/auth/lib/require-session";
import DashboardPage from "./dashboard/page";

/**
 * The root entry conditional router for the application.
 */
export default async function Home() {
    const session = await requireSession();

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
