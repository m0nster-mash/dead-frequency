import {getUserDetails} from "@/core/auth/lib/get-user-details";
import {role, user, userProfile, userRole, userStats,} from "@/core/auth/schema/auth.schema";
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {db} from "@/shared/db/client";
import {eq} from "drizzle-orm";
import {notFound} from "next/navigation";
import {JSX} from "react";

type Props = {
    params: Promise<{
        userId: string;
    }>;
};

export default async function UserProfilePage({params}: Props): Promise<JSX.Element> {
    const { userId } = await params;
    const { user, roles, profile, stats } = await getUserDetails(userId);

    return (
        <div>
            <PageHeader
                eyebrow="User Profile"
                title={user.name}
                subtitle={`Member since ${new Date(user.createdAt).toLocaleDateString()}`}
            />

            {/* Profile Bio & Banner */}
            <MainContentPanel title="Profile Overview">
                {profile?.bannerUrl && (
                    <div style={{marginBottom: "1rem", maxHeight: "180px", overflow: "hidden", borderRadius: "6px"}}>
                        <img
                            src={profile.bannerUrl}
                            alt={`${user.name}'s banner`}
                            style={{width: "100%", objectFit: "cover"}}
                        />
                    </div>
                )}

                <div style={{display: "flex", gap: "1.5rem", alignItems: "flex-start"}}>
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name}
                            style={{width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover"}}
                        />
                    ) : (
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "#333",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                fontWeight: "bold",
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div>
                        <h2 style={{margin: "0 0 0.25rem 0"}}>{user.name}</h2>
                        <p style={{margin: "0 0 0.5rem 0", color: "#666", fontSize: "0.9rem"}}>
                            {user.email} &bull;{" "}
                            <span>{user.emailVerified ? "Verified Account" : "Unverified Account"}</span>
                        </p>
                        <p style={{margin: 0}}>{profile?.bio || <em>No bio provided.</em>}</p>
                    </div>
                </div>
            </MainContentPanel>

            {/* Assigned Roles & Governance */}
            <MainContentPanel title="Assigned Roles">
                <ul style={{paddingLeft: "1.25rem", margin: 0}}>
                    {roles.map((r) => (
                        <li key={r.roleId} style={{marginBottom: "0.5rem"}}>
                            <strong>{r.name}</strong> (<code>{r.roleId}</code>)
                            {r.description && ` — ${r.description}`}
                            {r.bypassesCooldown && (
                                <span style={{
                                    marginLeft: "0.5rem",
                                    fontSize: "0.8rem",
                                    background: "#0070f3",
                                    color: "#fff",
                                    padding: "0.1rem 0.4rem",
                                    borderRadius: "3px"
                                }}>
                  Bypasses Cooldown
                </span>
                            )}
                        </li>
                    ))}
                    {roles.length === 0 && <li>Standard Member</li>}
                </ul>
            </MainContentPanel>

            {/* Activity Statistics & Standing */}
            <MainContentPanel title="Activity Metrics & Standing">
                <div
                    style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem"}}>
                    <div style={{padding: "0.75rem", border: "1px solid #333", borderRadius: "4px"}}>
                        <h4 style={{margin: "0 0 0.25rem 0"}}>Forum Posts</h4>
                        <p style={{margin: 0, fontSize: "1.25rem", fontWeight: "bold"}}>{stats.forumPostCount}</p>
                    </div>
                    <div style={{padding: "0.75rem", border: "1px solid #333", borderRadius: "4px"}}>
                        <h4 style={{margin: "0 0 0.25rem 0"}}>Chat Messages</h4>
                        <p style={{margin: 0, fontSize: "1.25rem", fontWeight: "bold"}}>{stats.chatMessageCount}</p>
                    </div>
                    <div style={{padding: "0.75rem", border: "1px solid #333", borderRadius: "4px"}}>
                        <h4 style={{margin: "0 0 0.25rem 0"}}>Chatbox Shouts</h4>
                        <p style={{margin: 0, fontSize: "1.25rem", fontWeight: "bold"}}>{stats.chatboxMessageCount}</p>
                    </div>
                    <div style={{padding: "0.75rem", border: "1px solid #333", borderRadius: "4px"}}>
                        <h4 style={{margin: "0 0 0.25rem 0"}}>Comments</h4>
                        <p style={{margin: 0, fontSize: "1.25rem", fontWeight: "bold"}}>{stats.commentCount}</p>
                    </div>
                    <div style={{padding: "0.75rem", border: "1px solid #333", borderRadius: "4px"}}>
                        <h4 style={{margin: "0 0 0.25rem 0"}}>Trust Score</h4>
                        <p style={{margin: 0, fontSize: "1.25rem", fontWeight: "bold"}}>{stats.trustScore}</p>
                    </div>
                </div>

                <p style={{marginTop: "1rem", fontSize: "0.85rem", color: "#888"}}>
                    Last
                    active: {stats.lastPostedAt ? new Date(stats.lastPostedAt).toLocaleString() : "No recent activity recorded"}
                </p>
            </MainContentPanel>
        </div>
    );
}
