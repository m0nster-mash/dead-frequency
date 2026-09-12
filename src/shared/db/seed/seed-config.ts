export const SEED_ROLES = [
    { id: "user", label: "User" },
    { id: "moderate", label: "Moderator" },
    { id: "admin", label: "Administrator" },
];

export const SEED_TEST_USERS = [
    {
        email: "user@test.local",
        name: "Test User",
        roleId: "user",
    },
    {
        email: "moderator@test.local",
        name: "Test Moderator",
        roleId: "moderate",
    },
    {
        email: "admin@test.local",
        name: "Test Admin",
        roleId: "admin",
    },
];
