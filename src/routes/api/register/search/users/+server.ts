import { searchRobloxUsers } from '$lib/roblox_api/search/middleware';
import { UserSearchRequestSchema, type UserSearchResponse } from '$lib/schemas/api/user_search';
import { getErrorMessage } from '$lib/util/get_error_message';
import { parseRequestBody } from '$lib/util/parse_request_body';
import { json, type RequestHandler } from '@sveltejs/kit';

async function trySearchUsers(query: string): Promise<UserSearchResponse> {
    try {
        const searchResult = await searchRobloxUsers(query);
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
