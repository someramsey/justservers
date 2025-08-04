import { isRobloxIdUsed } from "$lib/database/lowdb";
import { UserAvailableCheckRequestSchema } from "$lib/schemas/api/check_available";
import { parseRequestBody } from "$lib/util/parse_request_body";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const { robloxId } = await parseRequestBody(request, UserAvailableCheckRequestSchema);

    const isAvailable = !isRobloxIdUsed(robloxId);

    return json({ available: isAvailable });
};
