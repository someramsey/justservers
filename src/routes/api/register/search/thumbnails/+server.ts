import { findThumbnails } from "$lib/roblox_api/thumbnails/middleware";
import { ThumbnailSearchRequestSchema, type ThumbnailSearchResponse } from "$lib/schemas/api/thumbnail_search";
import { getErrorMessage } from "$lib/util/get_error_message";
import { parseRequestBody } from "$lib/util/parse_request_body";
import { json, type RequestHandler } from "@sveltejs/kit";

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
