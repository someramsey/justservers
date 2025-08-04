import { createUser, isRobloxIdUsed } from "$lib/database/lowdb";
import { getUserDetails } from "$lib/roblox_api/user/middleware";
import { RegisterRequestSchema, type RegistrationResponse } from "$lib/schemas/api/registration";
import { generateAccessToken } from "$lib/util/generate_access_token";
import { generateGUID } from "$lib/util/generate_guid";
import { parseRequestBody } from "$lib/util/parse_request_body";
import { json, type RequestHandler } from "@sveltejs/kit";

async function isUserIdValid(robloxId: number): Promise<boolean> {
    try {
        const userDetails = await getUserDetails(robloxId);
        return !!userDetails;
    } catch (error) {
        return false;
    }
}

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { robloxId, accessCode } = await parseRequestBody(request, RegisterRequestSchema);

    if (isRobloxIdUsed(robloxId)) {
        return json({ success: false, message: "This roblox account is already in use." } satisfies RegistrationResponse);
    }

    const isValidRobloxId = await isUserIdValid(robloxId);

    if (!isValidRobloxId) {
        return json({ success: false, message: "This roblox account Id could not be verified." } satisfies RegistrationResponse);
    }

    const accessToken = generateAccessToken(robloxId, accessCode);
    const clientId = generateGUID(128);

    createUser(robloxId, accessToken, clientId);

    cookies.set("access_token", accessToken, {
        path: "/"
    });

    return json({ success: true, clientId } satisfies RegistrationResponse);
};
