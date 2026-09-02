import {auth} from "@/core/auth";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {AvatarBuilder} from "@/feature/avatar/components/avatar-builder";
import {getAvatarConfigForUser} from "@/feature/avatar/lib/actions";
import {DEFAULT_AVATAR_CONFIG} from "@/feature/avatar/lib/options";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {JSX} from "react";

/**
 * A page that renders the personal account settings interface.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the user profile customization configuration layout
 */
export default async function SettingsPage(): Promise<JSX.Element> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    // Resolves personal design configurations, merging baseline assets on first-time generations
    const avatarConfig = (await getAvatarConfigForUser(session.user.id)) ?? DEFAULT_AVATAR_CONFIG;

    return (
        <div>
            <PageHeader eyebrow={"Avatar Controls"}
                        title={"Account Settings"}
                        subtitle={"Update your avatar"}/>

            <MainContentPanel title={"Edit Avatar"}>
                <AvatarBuilder initialConfig={avatarConfig}/>
            </MainContentPanel>
        </div>
    );
}
