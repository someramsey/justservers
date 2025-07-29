import { parseRequestBody } from '$lib/util/parse_request_body';
import { json, type RequestHandler } from '@sveltejs/kit';
import { UserSearchRequestSchema, type UserSearchResponse } from "./schemas";
import axios from 'axios';
import * as v from 'valibot';
import flatCache from 'flat-cache';
import { UserListSchema, type UserList } from './schemas';
import { getErrorMessage } from '$lib/util/get_error_message';

const cache = flatCache.create({
    cacheId: 'users',
    ttl: 60 * 60 * 1000,
    lruSize: 10_000,
    expirationInterval: 10 * 1000 * 60,
    persistInterval: 10 * 1000 * 60,
})

const LegacySearchUserSchema = v.object({
    name: v.string(),
    displayName: v.string(),

    id: v.number(),
});

const RobloxLegacySearchApiResponseSchema = v.object({
    data: v.array(LegacySearchUserSchema)
});

async function fetchLegacySearchApi(keyword: string, limit = 10): Promise<v.InferOutput<typeof LegacySearchUserSchema>[]> {
    const url = new URL('https://users.roblox.com/v1/users/search');
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('limit', limit.toString());

    return axios.get(url.toString(), { responseType: 'json' })
        .then(res => v.parse(RobloxLegacySearchApiResponseSchema, res.data))
        .then(resp => resp.data);
}

const OmniSearchUserSchema = v.object({
    username: v.string(),
    displayName: v.string(),
    contentId: v.number(),
    contentType: v.literal('User'),
});

const RobloxOmniSearchApiResponseSchema = v.object({
    searchResults: v.array(v.object({
        contentGroupType: v.string(), //filter for 'User'
        contents: v.array(OmniSearchUserSchema),
    })),
});

function createGuidForSession(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function fetchOmniSearchApi(username: string): Promise<v.InferOutput<typeof OmniSearchUserSchema>[]> {
    const url = new URL('https://apis.roblox.com/search-api/omni-search');
    url.searchParams.set('verticalType', 'user');
    url.searchParams.set('searchQuery', username);

    const guid = createGuidForSession();
    url.searchParams.set('globalSessionId', guid);
    url.searchParams.set('sessionId', guid);

    return axios.get(url.toString(), { responseType: 'json' })
        .then(res => v.parse(RobloxOmniSearchApiResponseSchema, res.data))
        .then(resp => resp.searchResults.filter(result => result.contentGroupType === 'User')
            .flatMap(result => result.contents)
        );
}


let currentApi: 'legacy' | 'omni' = 'legacy';

function switchApi() {
    currentApi = currentApi === 'legacy' ? 'omni' : 'legacy';
}

async function fetchCurrentApi(username: string): Promise<UserList> {
    switch (currentApi) {
        case 'legacy':
            return fetchLegacySearchApi(username)
                .then(results => results.map(user => ({
                    username: user.name,
                    displayName: user.displayName,
                    id: user.id
                })));
        case 'omni':
            return fetchOmniSearchApi(username)
                .then(results => results.map(user => ({
                    username: user.username,
                    displayName: user.displayName,
                    id: user.contentId
                })));
    }
}

async function fetchCurrentApiAndCache(username: string): Promise<UserList> {
    console.log(currentApi);

    return fetchCurrentApi(username)
        .then(result => {
            cache.setKey(username, result);
            return result;
        });
}

async function searchUsers(query: string): Promise<UserList> {
    const cached = cache.get(query);

    if (cached) {
        const { success, output } = v.safeParse(UserListSchema, cached);

        if (success) {
            return output;
        } else {
            cache.removeKey(query);
        }
    }
    try {
        return await fetchCurrentApiAndCache(query)
    } catch {
        switchApi();
        return await fetchCurrentApiAndCache(query);
    }
}

async function trySearchUsers(query: string): Promise<UserSearchResponse> {
    try {
        const searchResult = await searchUsers(query);
        return { success: true, data: searchResult };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}
export const POST: RequestHandler = async ({ request }) => {
    const { query } = await parseRequestBody(request, UserSearchRequestSchema);
    const results = await trySearchUsers(query);

    return json(results);
};
