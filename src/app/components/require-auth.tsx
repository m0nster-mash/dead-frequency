"use client";

import {ReactNode, useEffect} from "react";
import {useRouter} from "next/navigation";

export default function RequireAuth({session, children,}: {
    session: unknown;
    children: ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        // if (!session) {
        //     router.push("/login");
        // }
        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    if (!session) {
        return null;
    }

    return <>{children}</>;
}