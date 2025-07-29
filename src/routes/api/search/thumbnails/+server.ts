import { parseRequestBody } from "$lib/util/parse_request_body";
import { json, type RequestHandler } from "@sveltejs/kit";
import axios from 'axios';
import flatCache from 'flat-cache';
import * as v from 'valibot';
import { ThumbnailSearchRequestSchema, type ThumbnailReference, type ThumbnailSearchResponse } from "./schemas";
import { getErrorMessage } from "$lib/util/get_error_message";

const cache = flatCache.create({
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

async function findThumbnails(targetIds: number[]): Promise<ThumbnailReference[]> {
    const cacheResults: ThumbnailReference[] = [];
    const uncachedTargets: number[] = [];

    for (const id of targetIds) {
        const cacheEntry = cache.get<string>(id.toString());

        if (!!cacheEntry) {
            cacheResults.push({
                userId: id,
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
            cache.set(entry.targetId.toString(), entry.imageUrl);

            completedEntries.push({
                userId: entry.targetId,
                thumbnailUrl: entry.imageUrl
            });
        }
    }

    return [...cacheResults, ...completedEntries];
}

async function tryFindThumbnails(targets: number[]): Promise<ThumbnailSearchResponse> {
    try {
        const thumbnails = await findThumbnails(targets);
        return { success: true, data: thumbnails };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export const POST: RequestHandler = async ({ request }) => {
    const { targets } = await parseRequestBody(request, ThumbnailSearchRequestSchema);
    const results = await tryFindThumbnails(targets);

    return json(results);
};
