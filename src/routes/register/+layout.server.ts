import { getDemoTokenStatus, isAccessTokenValid } from '$lib/database/lowdb.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const accessToken = cookies.get('access_token');

    if (accessToken) {
        if (isAccessTokenValid(accessToken)) {
            throw redirect(302, `/games`);
        }

        const { isValid } = getDemoTokenStatus(accessToken);

        if (isValid) {
            throw redirect(302, `/games`);
        }
    }
}