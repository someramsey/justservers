import flatCache from 'flat-cache';
import ms from 'ms';

const thumbnailCache = flatCache.create({
    cacheId: 'roblox_thumbnails',
    ttl: ms("12h"),
    lruSize: 10_000,
    expirationInterval: ms("30m"),
    persistInterval: ms("10m"),
});

thumbnailCache.load();

export function cacheThumbnailUrl(userId: string, value: string): void {
    thumbnailCache.set(userId, value);
}

export function getCachedThumbnailUrl(userId: string): string | undefined {
    return thumbnailCache.get(userId);
}