import { JSONFilePreset } from 'lowdb/node'
import ms from 'ms';

//REFACTOR: Turn this module into a centralized interface for the database. Move user related logic into its own handler like the demo handler and make the database types be created by those scoped interfaces

const DEMO_TIME = ms('5m');

const low = await JSONFilePreset<{
    archivedUsers: number[],
    users: {
        [token: string]: {
            robloxId: number;
            knownClientIds: string[];
        }
    },
    demoSessions: {
        usedAddresses: string[];
        activeTokens: {
            token: string;
            createdAt: number;
        }[]
    }
}>('db.json', {
    users: {},
    archivedUsers: [],
    demoSessions: { usedAddresses: [], activeTokens: [] }
});

await low.read();

console.log("Database loaded");

const CLEANUP_INTERVAL = ms('30m');

removeExpiredDemoSessions();
setInterval(removeExpiredDemoSessions, CLEANUP_INTERVAL)


export function isRobloxIdUsed(robloxId: number): boolean {
    return Object.values(low.data.users).some(user => user.robloxId === robloxId);
}

export function isAccessTokenValid(accessToken: string): boolean {
    return Object.hasOwn(low.data.users, accessToken);
}

export function getUser(accessToken: string): { robloxId: number } | null {
    return low.data.users[accessToken] || null;
}

export function createUser(robloxId: number, accessToken: string, clientId: string): void {
    const archiveEntryIndex = low.data.archivedUsers.indexOf(robloxId);

    if (archiveEntryIndex !== -1) {
        low.data.archivedUsers.splice(archiveEntryIndex, 1);
    }

    low.data.users[accessToken] = {
        robloxId: robloxId,
        knownClientIds: [clientId]
    };

    low.write();
}

export function reassignUser(oldAccessToken: string, newAccessToken: string): void {
    const user = low.data.users[oldAccessToken];
    delete low.data.users[oldAccessToken];

    low.data.users[newAccessToken] = {
        robloxId: user.robloxId,
        knownClientIds: user.knownClientIds
    };

    low.write();
}

export function archiveUser(accessToken: string): void {
    const user = low.data.users[accessToken];
    delete low.data.users[accessToken];

    if (user) {
        low.data.archivedUsers.push(user.robloxId);
    }

    low.write();
}

export function createDemoSession(ipAddress: string, token: string): void {
    const timestamp = Date.now();

    low.data.demoSessions.usedAddresses.push(ipAddress);

    low.data.demoSessions.activeTokens.push({
        token: token,
        createdAt: timestamp
    });

    low.write();
}

export function endDemoSession(demoToken: string): void {
    for (let i = 0; i < low.data.demoSessions.activeTokens.length; i++) {
        if (low.data.demoSessions.activeTokens[i].token === demoToken) {
            low.data.demoSessions.activeTokens.splice(i, 1);
            break;
        }
    }

    low.write();
}

export function getDemoTokenStatus(demoToken: string): { isValid: true, expiresAt: number } | { isValid: false } {
    const session = low.data.demoSessions.activeTokens.find(token => token.token === demoToken);

    if (!session) {
        return { isValid: false };
    }

    const expiresAt = session.createdAt + DEMO_TIME;

    if (Date.now() > expiresAt) {
        return { isValid: false };
    }

    return { isValid: true, expiresAt };
}

export function removeExpiredDemoSessions() {
    const currentTime = Date.now();

    low.data.demoSessions.activeTokens = low.data.demoSessions.activeTokens.filter(
        token => currentTime - token.createdAt <= DEMO_TIME
    );

    low.write();
}

export function hasIpUsedDemo(ipAddress: string): boolean {
    return low.data.demoSessions.usedAddresses.includes(ipAddress);
}
