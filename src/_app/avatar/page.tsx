import {requireSession} from "@/_core/auth/lib/require-session";
import {MainContentPanel} from "@/_core/dashboard/components/panels/main-card";
import {PageHeader} from "@/_core/dashboard/components/panels/page-header";
import {AvatarBuilder} from "@/_feature/avatar/components/avatar-builder";
import {getAvatarConfigForUser} from "@/_feature/avatar/lib/actions";
import {DEFAULT_AVATAR_CONFIG} from "@/_feature/avatar/lib/options";
import {JSX} from "react";

/**
 * Personal account settings page.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the user profile customization configuration layout
 */
export default async function SettingsPage(): Promise<JSX.Element> {
    const session = await requireSession({ role: ["admin", "user"] });
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
