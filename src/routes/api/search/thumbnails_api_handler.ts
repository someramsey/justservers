import * as v from 'valibot';
import axios from 'axios';
import flatCache from 'flat-cache';

export const cache = flatCache.create({
    cacheId: 'thumbnails',
    ttl: 60 * 60 * 1000,
    lruSize: 10_000,
    expirationInterval: 10 * 1000 * 60,
    persistInterval: 10 * 1000 * 60,
})

cache.load();

const UserThumbnailInfoSchema = v.object({
    imageUrl: v.string(),
    targetId: v.number(),
    state: v.picklist(["Completed", "Pending", "Error"])        
});

type UserThumbnailInfo = v.InferOutput<typeof UserThumbnailInfoSchema>;

const ThumbnailsApiResponseSchema = v.object({
    data: v.array(UserThumbnailInfoSchema) 
});

async function fetchThumbnailApi(targets: number[]): Promise<UserThumbnailInfo[]> {
    const url = new URL('https://thumbnails.roblox.com/v1/batch');
    
    return axios.post(url.toString(), targets.map((target, index) => ({
        requestId: index,
        type: 'AvatarHeadshot',
        size: '150x150',
        format: 'webp',
        targetId: target
    })))
        .then(res => v.parse(ThumbnailsApiResponseSchema, res.data).data);
}

export async function findThumbnails(targets: number[]): Promise<UserThumbnailInfo[]> {
    const cacheResults: UserThumbnailInfo[] = [];
    const uncachedTargets: number[] = [];

    for (const target of targets) {
        const cacheEntry = cache.get<string>(target.toString());

        if (!!cacheEntry) {
            cacheResults.push({
                targetId: target,
                imageUrl: cacheEntry,
                state: 'Completed'
            });
        } else {
            uncachedTargets.push(target);
        }
    }

    const fetchResults = await fetchThumbnailApi(uncachedTargets);
    const completedEntries = fetchResults.filter(x => x.state === 'Completed');

    for (const entry of completedEntries) {
        cache.set(entry.targetId.toString(), entry.imageUrl);
    }

    return [...fetchResults, ...cacheResults];
}



 
