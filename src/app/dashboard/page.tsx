import {auth} from "@/core/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import LoremIpsum from "@shared/components/lorem-ipsum";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

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
                                level: 2,
                            },
                            {
                                id: "split-content-panel",
                                label: "Split Content Panel Example",
                                level: 2,
                            }]}
            />
            <MainContentPanel title={"Example: Main Content Panel"} id={"main-content-panel"}>
                <p>
                    This panel contains a title, a simple content area for any amount or kind of content, and a "return
                    to home" arrow button at the bottom.
                </p>
                <p>
                    Now, here's some filler text to pad the area:
                </p>
                <hr/>
                <LoremIpsum length={3} regular={true}/>
            </MainContentPanel>
        </>
    );
}