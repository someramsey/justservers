import type { RequestHandler } from '@sveltejs/kit';
import * as v from 'valibot';
import { searchUsers } from './users_api_handler';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	const query = v.parse(v.string(), url.searchParams.get('query'));

	setHeaders({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			
			
			
			// searchUsers(query);
			controller.enqueue(encoder.encode("dw"));
			controller.close();
		}
	});

	return new Response(stream);
};
