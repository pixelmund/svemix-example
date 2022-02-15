import type { GetSession } from '@sveltejs/kit';
import { handleSession } from 'svemix/session';

export const getSession: GetSession = ({ locals }) => {
	return locals.session.data;
};

export const handle = handleSession({ secret: 'SOME_SECRET_VALUE', getSession });
