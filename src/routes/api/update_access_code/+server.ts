import * as db from "$lib/database/lowdb";
import { UpdateAccessCodeRequestSchema, type UpdateAccessCodeResponse } from "$lib/schemas/api/update_access_code";
import { generateAccessToken } from "$lib/util/generate_access_token";
import { parseRequestBody } from "$lib/util/parse_request_body";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { code: newCode } = await parseRequestBody(request, UpdateAccessCodeRequestSchema);

    const oldAccessToken = cookies.get("access_token");

    if (!oldAccessToken) {
        return json({ success: false, message: "Current access TOKEN is missing" } satisfies UpdateAccessCodeResponse);
    }

    const user = db.getUser(oldAccessToken);

    if (!user) {
        return json({ success: false, message: "Current access TOKEN is invalid" } satisfies UpdateAccessCodeResponse);
    }

    const newAccessToken = generateAccessToken(user.robloxId, newCode);

    if (newAccessToken === oldAccessToken) {
        return json({ success: false, message: "New access code must be different from the current one" } satisfies UpdateAccessCodeResponse);
    }

    db.reassignUser(oldAccessToken, newAccessToken);

    cookies.set("access_token", newAccessToken, {
        path: "/"
    });

    return json({ success: true } satisfies UpdateAccessCodeResponse)
};
