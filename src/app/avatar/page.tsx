import {getAvatarConfigForUser} from "@/adapters/host-avatar-data-adapter";
import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {JSX} from "react";
import {AvatarBuilder} from "../../../packages/feature-avatar/src/components/avatar-builder";
import {DEFAULT_AVATAR_CONFIG} from "../../../packages/feature-avatar/src/lib/options";

/**
 * Personal account settings page.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the user profile customization configuration layout
 */
export default async function SettingsPage(): Promise<JSX.Element> {
    const session = await requireSession();
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
