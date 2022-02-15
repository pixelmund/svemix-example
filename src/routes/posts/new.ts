import { get as __get, post as __post } from 'svemix/server';

import { Action, Loader, redirect } from 'svemix/server';
import { readingTime, truncateString, slugify } from '$lib/post';
import db from '$lib/db';

interface LoadedData {}

interface ActionData {
	title: string;
	content: string;
}

export const action: Action = async ({ request, locals }) => {
	const body = await request.formData();

	const title = body.get('title') as string;
	const content = body.get('content') as string;

	if (!title || title.length === 0) {
		return {
			errors: {
				content: '',
				title: 'Please provide a title'
			}
		};
	}

	const slug = slugify(title);
	const excerpt = truncateString(content, 150);
	const readTime = readingTime(content);

	const post = await db.post.create({
		data: {
			content,
			slug,
			read_time: readTime,
			excerpt,
			title,
			user: { connect: { id: locals.session.data.user.id } }
		}
	});

	return redirect(`/posts/${post.slug}`, 302);
};

export const loader: Loader<LoadedData> = ({ locals }) => {
	if (!locals.session.data?.isLoggedIn) {
		return redirect('/auth/login', 302);
	}

	return {};
};

export const get = __get(loader);
export const post = __post(action);
