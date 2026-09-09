"use server";

import {auth} from "@/core/auth";
import {headers} from "next/headers";

export async function signOutAction() {
    await auth.api.signOut({headers: await headers()});
}
