import { get as __get, post as __post } from 'svemix/server';

import type { Loader } from 'svemix/server';
import type { Post } from '@prisma/client';
import db from '$lib/db';

interface LoaderData {
	post: Post;
}

export const loader: Loader<LoaderData> = async function ({ params }) {
	try {
		const post = await db.post.findUnique({
			where: { slug: params.slug },
			rejectOnNotFound: false
		});

		if (!post) {
			throw new Error('Post not found');
		}

		return {
			post,
			metadata: {
				title: post.title,
				description: post.excerpt
			}
		};
	} catch (error) {
		throw new Error(error);
	}
};

export const get = __get(loader);
