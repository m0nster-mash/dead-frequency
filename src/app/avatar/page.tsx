import {saveAvatarConfigAction} from "@/adapters/avatar-server-actions";
import {getAvatarConfigForUser} from "@/adapters/host-avatar-data-adapter";
import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {JSX} from "react";
import {AvatarBuilder} from "../../../packages/feature-avatar/src/components/avatar-builder";
import {AvatarProvider} from "../../../packages/feature-avatar/src/components/avatar-provider";
import {DEFAULT_AVATAR_CONFIG} from "../../../packages/feature-avatar/src/lib/options";

export default async function AvatarSettingsPage(): Promise<JSX.Element> {
    const session = await requireSession();
    const avatarConfig = (await getAvatarConfigForUser(session.user.id)) ?? DEFAULT_AVATAR_CONFIG;

    return (
        <div>
            <PageHeader eyebrow={"Avatar Controls"}
                        title={"Account Settings"}
                        subtitle={"Update your avatar"}/>

            <MainContentPanel title={"Edit Avatar"}>
                <AvatarProvider saveAvatarConfig={saveAvatarConfigAction}>
                    <AvatarBuilder initialConfig={avatarConfig}/>
                </AvatarProvider>
            </MainContentPanel>
        </div>
    );
}
