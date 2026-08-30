import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import LoremIpsum from "@shared/components/lorem-ipsum";

export default async function HomePage() {

    return (
        <MainContentPanel title={"Home Page"}>
            <LoremIpsum length={4} regular={false}/>
        </MainContentPanel>
    );
}