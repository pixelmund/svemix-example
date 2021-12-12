import { handleSession } from 'svelte-kit-cookie-session';

export const handle = handleSession<Locals['session'], Locals>(
	{ secret: 'SOME_SECRET_VALUE' },
	function ({ request, resolve }) {
		const response = resolve(request);

		return response;
	}
);
