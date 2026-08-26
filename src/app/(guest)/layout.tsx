import GuestLayout from "@/app/components/guest-layout";
import {auth} from "@core/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import React from "react";

export default async function GuestGroupLayout({children}: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session?.user) {
        redirect("/dashboard");
    }

    return <GuestLayout>{children}</GuestLayout>;
}