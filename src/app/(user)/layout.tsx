import UserLayout from "@/app/components/user-layout";
import {auth} from "@/core/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import React from "react";

export default async function UserGroupLayout({children}: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    return <UserLayout>{children}</UserLayout>;
}