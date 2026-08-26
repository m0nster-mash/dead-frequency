import {auth} from "@/core/auth";
import UserLayout from "./user-layout"
import GuestLayout from "./guest-layout"
import React from "react";
import {headers} from "next/headers";

export default async function SessionLayout({children}: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session?.user) {
        return <UserLayout>{children}</UserLayout>;
    }
    return <GuestLayout>{children}</GuestLayout>;
}