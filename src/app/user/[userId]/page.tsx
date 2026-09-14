import {requireSession} from "@/core/auth/lib/require-session";
import {user, userProfile, userStats} from "@/core/auth/schema/auth.schema";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
// import { character } from "@/shared/db/schema";
import {db} from "@/shared/db/client";
import buttonStyle from "@/shared/styles/buttons.module.css";
import panelStyle from "@/shared/styles/panel.module.css";
import cardStyle from "@/shared/styles/patterns/card.module.css";
import tableStyle from "@/shared/styles/tables.module.css";
import {eq} from "drizzle-orm";
import Link from "next/link";
import {notFound} from "next/navigation";

type Props = {
    params: Promise<{
        userId: string;
    }>;
};

/**
 * Public and Self User Profile Page.
 */
export default async function UserProfilePage({params}: Props) {
    const {userId} = await params;
    const session = await requireSession();
    const isOwner = session?.user?.id === userId;
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

    // // Fetch active characters owned by this user account
    // const ownedCharacters = await db
    //     .select({
    //         id: character.id,
    //         name: character.name,
    //         slug: character.slug,
    //         createdAt: character.createdAt,
    //     })
    //     .from(character)
    //     .where(and(eq(character.ownerUserId, userId), isNull(character.deletedAt)));

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
                <div className={tableStyle.tableWrapper}>
                    <table className={tableStyle.table}>
                        <thead>
                        <tr>
                            <th>Character Name</th>
                            <th>Slug</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*{ownedCharacters.map((char) => (*/}
                        {/*    <tr key={char.id}>*/}
                        {/*        <td>*/}
                        {/*            <strong>{char.name}</strong>*/}
                        {/*        </td>*/}
                        {/*        <td>*/}
                        {/*            <code>{char.slug}</code>*/}
                        {/*        </td>*/}
                        {/*        <td>{new Date(char.createdAt).toLocaleDateString()}</td>*/}
                        {/*        <td>*/}
                        {/*            <Link*/}
                        {/*                href={`/character/${char.id}`}*/}
                        {/*                className={`${buttonStyle.btn} ${buttonStyle.btnSecondary}`}*/}
                        {/*            >*/}
                        {/*                View Profile*/}
                        {/*            </Link>*/}
                        {/*        </td>*/}
                        {/*    </tr>*/}
                        {/*))}*/}
                        {/*{ownedCharacters.length === 0 && (*/}
                        {/*    <tr>*/}
                        {/*        <td colSpan={4} className={tableStyle.tableEmptyCell}>*/}
                        {/*            This user does not own any characters yet.*/}
                        {/*        </td>*/}
                        {/*    </tr>*/}
                        {/*)}*/}
                        </tbody>
                    </table>
                </div>
            </MainContentPanel>
        </div>
    );
}
