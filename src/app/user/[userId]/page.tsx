import {requireSession} from "@/core/auth/lib/require-session";
import {user, userProfile, userStats} from "@/core/auth/schema/auth.schema";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
// import { character } from "@/shared/db/schema";
import {db} from "@/shared/db/client";
import buttonStyle from "@/shared/styles/buttons.module.css";
import panelStyle from "@/shared/styles/panel.module.css";
import cardStyle from "@/shared/styles/patterns/card.module.css";
import {MODULE_KEYS} from "@shared/constants/modules";
import {isModuleEnabled} from "@shared/lib/modules";
import {eq} from "drizzle-orm";
import Link from "next/link";
import {notFound} from "next/navigation";
import {CharacterProfileCard, getCharactersForUser} from "../../../../packages/feature-character";

type Props = {
    params: Promise<{
        userId: string;
    }>;
};

/**
 * Public and Self User Profile Page.
 */
export default async function UserProfilePage({params}: Props) {
    type CharacterItem = Awaited<ReturnType<typeof getCharactersForUser>>[number];

    const {userId} = await params;
    const session = await requireSession().catch(() => null);
    const isOwner = session?.user?.id === userId;
    const characterModuleEnabled = await isModuleEnabled(MODULE_KEYS.CHARACTERS);
    const userCharacters: CharacterItem[] = characterModuleEnabled
        ? await getCharactersForUser(db, userId)
        : [];
    const [userData] = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt,
            bio: userProfile.bio,
            bannerUrl: userProfile.bannerUrl,
            forumPostCount: userStats.forumPostCount,
            chatMessageCount: userStats.chatMessageCount,
            chatboxMessageCount: userStats.chatboxMessageCount,
            commentCount: userStats.commentCount,
            trustScore: userStats.trustScore,
        })
        .from(user)
        .leftJoin(userProfile, eq(userProfile.userId, user.id))
        .leftJoin(userStats, eq(userStats.userId, user.id))
        .where(eq(user.id, userId))
        .limit(1);

    if (!userData) {
        notFound();
    }

    return (
        <div>
            <PageHeader eyebrow="User Profile"
                        title={userData.name}
                        subtitle={`Member since ${new Date(userData.createdAt).toLocaleDateString()}`}/>

            {isOwner && (
                <div className={panelStyle.panel}>
                    <div className={panelStyle.actions}>
                        <Link href="/settings"
                              className={`${buttonStyle.btn} ${buttonStyle.btnPrimary}`}>
                            Edit Account & Profile
                        </Link>
                    </div>
                </div>
            )}

            <MainContentPanel title="About">
                <div className={cardStyle.card}>
                    <p>{userData.bio || "This user has not provided a bio yet."}</p>
                </div>
            </MainContentPanel>

            <MainContentPanel title="Activity Statistics">
                <div className={cardStyle.grid}>
                    <div className={cardStyle.card}>
                        <h3>Forum Posts</h3>
                        <p className={cardStyle.statValue}>
                            {userData.forumPostCount ?? 0}
                        </p>
                    </div>
                    <div className={cardStyle.card}>
                        <h3>Chatbox Messages</h3>
                        <p className={cardStyle.statValue}>
                            {userData.chatboxMessageCount ?? 0}
                        </p>
                    </div>
                    <div className={cardStyle.card}>
                        <h3>Comments</h3>
                        <p className={cardStyle.statValue}>
                            {userData.commentCount ?? 0}
                        </p>
                    </div>
                    <div className={cardStyle.card}>
                        <h3>Trust Score</h3>
                        <p className={cardStyle.statValue}>
                            {userData.trustScore ?? 0}
                        </p>
                    </div>
                </div>
            </MainContentPanel>

            <MainContentPanel title="Owned Characters">
                <div className={panelStyle.detailsSection}>
                    <h2>Member Details</h2>
                    <p>User ID: {userId}</p>
                </div>

                {characterModuleEnabled && (
                    <div className={panelStyle.charactersSection}>
                        <div className={panelStyle.sectionHeader}>
                            <h3>Owned Characters ({userCharacters.length} / 10)</h3>
                            {isOwner && (
                                <Link href="/character/create" className={panelStyle.createButton}>
                                    + Create Character
                                </Link>
                            )}
                        </div>

                        {userCharacters.length > 0 ? (
                            <div className={panelStyle.grid}>
                                {userCharacters.map((char) => (
                                    <CharacterProfileCard key={char.id}
                                                          character={char}
                                                          isOwner={isOwner}/>
                                ))}
                            </div>
                        ) : (
                            <p className={panelStyle.emptyState}>
                                This user has not created any characters yet.
                            </p>
                        )}
                    </div>
                )}
            </MainContentPanel>
        </div>
    );
}
