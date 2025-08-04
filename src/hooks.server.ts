import type { Handle } from '@sveltejs/kit';

import '$lib/database/lowdb.js';

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};
