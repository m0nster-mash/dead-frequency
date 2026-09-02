import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/core/auth";
import {AvatarBuilder} from "@/feature/avatar/components/avatar-builder";
import {getAvatarConfigForUser} from "@/feature/avatar/lib/actions";
import {DEFAULT_AVATAR_CONFIG} from "@/feature/avatar/lib/options";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const avatarConfig = (await getAvatarConfigForUser(session.user.id)) ?? DEFAULT_AVATAR_CONFIG;

    return (
        <div>
            <PageHeader
                eyebrow={"Avatar Controls"}
                title={"Account Settings"}
                subtitle={"Update your avatar"}/>

            <MainContentPanel title={"Edit Avatar"}>
                <AvatarBuilder initialConfig={avatarConfig}/>
            </MainContentPanel>
        </div>
    );
}