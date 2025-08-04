import * as db from '$lib/database/lowdb.js';
import type { OperationResultResponse } from '$lib/schemas/api/common';
import { generateGUID } from "$lib/util/generate_guid";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies, getClientAddress }) => {
    const ip = getClientAddress();

    if (db.hasIpUsedDemo(ip)) {
        return json({
            success: false,
            message: 'Demo session already used'
        });
    }

    const demoToken = generateGUID(64);

    db.createDemoSession(ip, demoToken);
    
    cookies.set('access_token', demoToken, {
        path: '/',
    });
    
    return json({ success: true } satisfies OperationResultResponse);
};
