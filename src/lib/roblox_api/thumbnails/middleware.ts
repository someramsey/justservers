import axios from 'axios';
import * as v from 'valibot';
import { cacheThumbnailUrl, getCachedThumbnailUrl } from './cache';

type ThumbnailReference = {
    thumbnailUrl: string,
    robloxId: number,
};

const UserThumbnailInfoSchema = v.object({
    imageUrl: v.string(),
    targetId: v.number(),
    state: v.union([
        v.picklist(["Completed", "Pending", "Error", "Blocked"]),
        v.string()
    ])
});

type ThumbnailApiItem = v.InferOutput<typeof UserThumbnailInfoSchema>;

const ThumbnailsApiResponseSchema = v.object({
    data: v.array(UserThumbnailInfoSchema)
});

async function fetchThumbnailApi(targets: number[]): Promise<ThumbnailApiItem[]> {
    if (targets.length === 0) {
        return [];
    }
    
    const url = new URL('https://thumbnails.roblox.com/v1/batch');
    const body = targets.map((target, index) => ({
        requestId: index,
        type: 'AvatarHeadshot',
        size: '150x150',
        format: 'webp',
        targetId: target
    }));

    return axios.post(url.toString(), body, { responseType: 'json' })
        .then(({ data: body }) => v.parse(ThumbnailsApiResponseSchema, body).data);
}

export async function findThumbnails(targetIds: number[]): Promise<ThumbnailReference[]> { //throws
    const cacheResults: ThumbnailReference[] = [];
    const uncachedTargets: number[] = [];

    for (const id of targetIds) {
        const cacheEntry = getCachedThumbnailUrl(id.toString());

        if (cacheEntry) {
            cacheResults.push({
                robloxId: id,
                thumbnailUrl: cacheEntry
            });
        } else {
            uncachedTargets.push(id);
        }
    }

    const fetchResults = await fetchThumbnailApi(uncachedTargets);

    const completedEntries: ThumbnailReference[] = [];

    for (const entry of fetchResults) {
        if (entry.state === 'Completed') {
            cacheThumbnailUrl(entry.targetId.toString(), entry.imageUrl);

            completedEntries.push({
                robloxId: entry.targetId,
                thumbnailUrl: entry.imageUrl
            });
        }
    }

    return [...cacheResults, ...completedEntries];
}

