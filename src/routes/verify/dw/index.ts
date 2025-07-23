import flatCache from 'flat-cache';

export const cache = flatCache.createFromFile('diskcache', {
    ttl: 60 * 60 * 1000,
    lruSize: 10_000,
    expirationInterval: 5 * 1000 * 60,
    persistInterval: 5 * 1000 * 60
})

cache.load();