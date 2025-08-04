import flatCache from 'flat-cache';
import ms from 'ms';
import type { UserSearchResult } from './user_search_result';

const userSearchCache = flatCache.create({
    cacheId: 'roblox_user_searches',
    ttl: ms("24h"),
    lruSize: 10_000,
    expirationInterval: ms("30m"),
    persistInterval: ms("10m"),
});

userSearchCache.load();

export function cacheUserSearch(keyword: string, users: UserSearchResult) {
    userSearchCache.setKey(keyword, users);
}

export function getCachedUserSearch(keyword: string): UserSearchResult | undefined {
    return userSearchCache.getKey(keyword);
}