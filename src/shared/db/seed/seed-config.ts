import {randomUUID} from "node:crypto";

export const SEED_ROLES = [
    {
        id: "user",
        name: "User",
        description: "Standard registered user account with posting capabilities",
        bypassesCooldown: false
    },
    {
        id: "moderate",
        name: "Moderator",
        description: "Content moderation, audit log access, and user sanction rights",
        bypassesCooldown: true
    },
    {
        id: "admin",
        name: "Administrator",
        description: "Full administrative access across all modules",
        bypassesCooldown: true
    },
];

export const SEED_TEST_USERS = [
    {
        id: randomUUID(),
        email: "user@test.local",
        name: "Test User",
        roleId: "user",
        bio: "Standard registered user account with posting capabilities"
    },
    {
        id: randomUUID(),
        email: "moderator@test.local",
        name: "Test Moderator",
        roleId: "moderate",
        bio: "Content moderation, audit log access, and user sanction rights"
    },
    {
        id: randomUUID(),
        email: "admin@test.local",
        name: "Test Admin",
        roleId: "admin",
        bio: "Full administrative access across all modules"
    },
];
