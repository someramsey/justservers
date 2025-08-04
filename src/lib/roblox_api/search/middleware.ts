import { cacheUserSearch, getCachedUserSearch } from "./cache";
import axios from "axios";
import * as v from "valibot";
import type { UserSearchResult } from "./user_search_result";
 
const LegacySearchUserSchema = v.object({
    name: v.string(),
    displayName: v.string(),

    id: v.number(),
});

const RobloxLegacySearchApiResponseSchema = v.object({
    data: v.array(LegacySearchUserSchema)
});

async function fetchLegacySearchApi(keyword: string, limit = 10): Promise<v.InferOutput<typeof LegacySearchUserSchema>[]> {
    const url = new URL("https://users.roblox.com/v1/users/search");
    url.searchParams.set("keyword", keyword);
    url.searchParams.set("limit", limit.toString());

    return axios.get(url.toString(), { responseType: "json" })
        .then(res => v.parse(RobloxLegacySearchApiResponseSchema, res.data))
        .then(resp => resp.data);
}

const OmniSearchUserSchema = v.object({
    username: v.string(),
    displayName: v.string(),
    contentId: v.number(),
    contentType: v.literal("User"),
});

const RobloxOmniSearchApiResponseSchema = v.object({
    searchResults: v.array(v.object({
        contentGroupType: v.string(), //filter for "User"
        contents: v.array(OmniSearchUserSchema),
    })),
});

async function fetchOmniSearchApi(username: string): Promise<v.InferOutput<typeof OmniSearchUserSchema>[]> {
    function createGuidForSession(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const url = new URL("https://apis.roblox.com/search-api/omni-search");
    url.searchParams.set("verticalType", "user");
    url.searchParams.set("searchQuery", username);

    const guid = createGuidForSession();
    url.searchParams.set("globalSessionId", guid);
    url.searchParams.set("sessionId", guid);

    return axios.get(url.toString(), { responseType: "json" })
        .then(res => v.parse(RobloxOmniSearchApiResponseSchema, res.data))
        .then(resp => resp.searchResults.filter(result => result.contentGroupType === "User")
            .flatMap(result => result.contents)
        );
}


let currentApi: "legacy" | "omni" = "legacy";

function switchApi() {
    currentApi = currentApi === "legacy" ? "omni" : "legacy";
}

async function fetchCurrentApi(username: string): Promise<UserSearchResult> {
    switch (currentApi) {
        case "legacy":
            return fetchLegacySearchApi(username)
                .then(results => results.map(user => ({
                    username: user.name,
                    displayName: user.displayName,
                    robloxId: user.id
                })));
        case "omni":
            return fetchOmniSearchApi(username)
                .then(results => results.map(user => ({
                    username: user.username,
                    displayName: user.displayName,
                    robloxId: user.contentId
                })));
    }
}

async function fetchCurrentApiAndCache(username: string): Promise<UserSearchResult> {
    const results = await fetchCurrentApi(username)

    cacheUserSearch(username, results.map(user => ({
        username: user.username,
        displayName: user.displayName,
        robloxId: user.robloxId
    })));

    return results;
}

export async function searchRobloxUsers(query: string): Promise<UserSearchResult> {
    const cached = getCachedUserSearch(query);
   
    if (cached) {
        return cached;
    }

    try {
        return await fetchCurrentApiAndCache(query)
    } catch {
        switchApi();
        return await fetchCurrentApiAndCache(query);
    }
}
