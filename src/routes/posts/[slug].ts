import { get as __get, post as __post } from 'svemix/server';

import type { Loader } from 'svemix/server';
import type { Post } from '@prisma/client';
import db from '$lib/db';

interface Props {
	post: Post;
}

export const loader: Loader<Props> = async function ({ params }) {
	try {
		const post = await db.post.findUnique({
			where: { slug: params.slug },
			rejectOnNotFound: false
		});

		if (!post) {
			return {
				status: 404,
				error: 'Post not found'
			};
		}

		return {
			data: {
				post
			},
			metadata: {
				title: post.title,
				description: post.excerpt
			}
		};
	} catch (error) {
		return {
			status: 500,
			error
		};
	}
};

export const get = __get(loader);
