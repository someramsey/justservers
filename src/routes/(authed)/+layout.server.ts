import * as db from '$lib/database/lowdb.js';
import { findThumbnails } from '$lib/roblox_api/thumbnails/middleware.js';
import { getUserDetails } from '$lib/roblox_api/user/middleware.js';
import { error, redirect } from '@sveltejs/kit';

type RouteProps = {
    user: {
        mode: "authenticated";
        displayName: string;
        thumbnailUrl: string | null
    } | {
        mode: "demo";
        expirationTime: number;
    }
}

export async function load({ cookies }): Promise<RouteProps> {
    const accessToken = cookies.get('access_token');
    if (!accessToken) {
        throw redirect(302, `/`);
    }

    try {
        const user = db.getUser(accessToken);
        if (!user) {
            const tokenStatus = db.getDemoTokenStatus(accessToken);

            if (tokenStatus.isValid) {
                return { user: { mode: "demo", expirationTime: tokenStatus.expiresAt } };
            }

            cookies.delete('access_token', { path: '/' });
            throw redirect(302, `/`);
        }

        const [userDetails, [thumbnail]] = await Promise.all([
            getUserDetails(user.robloxId),
            findThumbnails([user.robloxId]).catch(() => [null])
        ]);

        return {
            user: {
                mode: "authenticated",
                displayName: userDetails.displayName,
                thumbnailUrl: thumbnail?.thumbnailUrl || null
            }
        };
    } catch (err) {
        console.error('[/games]: Failed to load user details:', err);

        throw error(500, {
            message: 'Failed to load user details'
        });
    }

}