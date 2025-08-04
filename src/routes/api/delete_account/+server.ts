import * as db from "$lib/database/lowdb";
import type { OperationResultResponse } from "$lib/schemas/api/common";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
    const oldAccessToken = cookies.get("access_token");

    if (!oldAccessToken) {
        return json({ success: false, message: "Current access TOKEN is missing" } satisfies OperationResultResponse);
    }

    const user = db.getUser(oldAccessToken);

    if (!user) {
        return json({ success: false, message: "Current access TOKEN is invalid" } satisfies OperationResultResponse);
    }

    db.archiveUser(oldAccessToken);

    cookies.delete("access_token", {
        path: "/"
    });

    return json({ success: true } satisfies OperationResultResponse)
};
