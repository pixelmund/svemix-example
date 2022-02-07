import { get as __get, post as __post } from 'svemix/server';

import type { Action, Loader } from 'svemix/server';
import type { Post } from '@prisma/client';
import db from '$lib/db';

interface Props {
	posts: Post[];
	pageInfo: {
		totalPages: number;
		currentPage: number;
		totalCount: number;
	};
}

const TAKE = 6;

export const loader: Loader<Props> = async function ({ url }) {
	const page = parseInt(url.searchParams.get('page')) || 1;
	const skip = (page - 1) * TAKE;

	const [totalCount, posts] = await db.$transaction([
		db.post.count(),
		db.post.findMany({ take: TAKE, skip, orderBy: { createdAt: 'desc' } })
	]);

	const totalPages = Math.ceil(totalCount / TAKE);

	return {
		data: {
			pageInfo: {
				totalPages,
				currentPage: page,
				totalCount
			},
			posts
		}
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
