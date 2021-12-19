import type { GetSession } from '@sveltejs/kit';
import { handleSession } from 'svemix/session';

export const getSession: GetSession<Locals> = ({ locals }) => {
	return locals.session.data;
};

export const handle = handleSession<Locals['session'], Locals>(
	{ secret: 'SOME_SECRET_VALUE' },
	function ({ request, resolve }) {
		const response = resolve(request);

		return response;
	}
);
