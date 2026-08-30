"use client";

import {useRouter} from "next/navigation";
import {useEffect, useCallback, ReactNode} from "react";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";

export default function Modal({children}: { children: ReactNode }) {
    const router = useRouter();

    const close = useCallback(() => {
        router.back();
    }, [router]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [close]);

    return (
        <MainContentPanel title={"Login / Register"}>
        <div onClick={close}
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div onClick={(e) => e.stopPropagation()}
                 className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <button onClick={close}
                        aria-label="Close"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    ✕
                </button>
                {children}
            </div>
        </div>
            </MainContentPanel>
    );
}