import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {AvatarRenderer} from "@/core/avatar";
import {BACKGROUND_OPTIONS, EYES_OPTIONS, MOUTH_OPTIONS, HAIR_OPTIONS} from "@/core/avatar/lib/options";

export default async function AvatarTestPage() {

    const combos =
        HAIR_OPTIONS.flatMap((hair) =>
            EYES_OPTIONS.flatMap((eyes) =>
                MOUTH_OPTIONS.flatMap((mouth) =>
                    BACKGROUND_OPTIONS.map((background) => ({
                        eyes: eyes.id,
                        mouth: mouth.id,
                        background: background.id,
                        hair: hair.id
                    }))
                )
            ));

    return (
        <MainContentPanel title={"Avatar Test Page"}>
            <div style={{display: "flex", flexWrap: "wrap", gap: "12px"}}>
                {combos.map((config, i) => (
                    <div key={i} style={{textAlign: "center"}}>
                        <AvatarRenderer config={{version: 1, ...config}} size={80}/>
                        <div style={{fontSize: 10}}>
                            {config.eyes}/{config.mouth}/{config.background}/{config.hair}
                        </div>
                    </div>
                ))}
            </div>
        </MainContentPanel>
    );
}