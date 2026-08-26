import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/core/auth";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    redirect(session ? .user ? "/dashboard" : "/register");
}