import { get as __get, post as __post } from 'svemix/server';

import type { Action, Loader } from 'svemix/server';
import type { Post } from '@prisma/client';
import db from '$lib/db';
interface LoaderData {
	posts: Post[];
}

export const loader: Loader<LoaderData> = async function () {
	const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } });

	return {
		posts
	};
};

export const action: Action<any> = async function ({ locals, request }) {
	const body = await request.formData();

	const _action = body.get('_action');

	if (_action === 'logout') {
		locals.session.destroy();
	}

	return {};
};

export const get = __get(loader);
export const post = __post(action);
