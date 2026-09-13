import {requireSession} from "@/core/auth/lib/require-session";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import LoremIpsum from "@/shared/components/lorem-ipsum";
import {JSX} from "react";

/**
 * A page that serves as the root landing viewport for the dashboard.
 *
 * @returns {Promise<JSX.Element>} A promise resolving to the user workspace dashboard landing viewport.
 */
export default async function DashboardPage(): Promise<JSX.Element> {
    const session = await requireSession();
    const username = session.user.name;

    return (
        <>
            <PageHeader eyebrow={"Example: Page Header"}
                        title={"Welcome back, " + username}
                        subtitle={"Here's what you've missed..."}
                        items={[
                            {
                                id: "main-content-panel",
                                label: "Main Content Panel Example",
                                level: 2
                            },
                            {
                                id: "split-content-panel",
                                label: "Split Content Panel Example",
                                level: 2
                            }]}/>

            <MainContentPanel title={"Example: Main Content Panel"}
                              id={"main-content-panel"}>
                <LoremIpsum length={5} regular={true}/>
            </MainContentPanel>
        </>
    );
}
