import * as db from '$lib/database/lowdb.js';
import type { OperationResultResponse } from '$lib/schemas/api/common';
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
    const demoToken = cookies.get('access_token'); 

    if (!demoToken) {
        return json({ success: false, error: 'Missing session token' }, { status: 400 });
    }

    cookies.delete('access_token', {
        path: '/',
    });
    
    db.endDemoSession(demoToken);
    
    return json({ success: true } satisfies OperationResultResponse);
};
