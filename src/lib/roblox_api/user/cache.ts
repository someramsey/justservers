import flatCache from 'flat-cache';
import ms from 'ms';
import type { UserDetails } from './user_details';

const userDetailsCache = flatCache.create({
    cacheId: 'roblox_usernames',
    ttl: ms("12h"),
    lruSize: 10_000,
    expirationInterval: ms("30m"),
    persistInterval: ms("10m"),
});

export function getCachedUserDetails(userId: number): UserDetails | undefined {
    return userDetailsCache.get(userId.toString());
}

export function cacheUserDetails(userId: number, userDetails: UserDetails): void {
    userDetailsCache.set(userId.toString(), userDetails);
}