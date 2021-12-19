
  import { getHandler, postHandler } from "svemix/server";

  
	import type { Action, Loader } from 'svemix/server';
	import { readingTime, truncateString, slugify } from '$lib/post';
	import db from '$lib/db';

	interface LoadedData {}

	interface ActionData {
		title: string;
		content: string;
	}

	export const action: Action<ActionData, Locals> = async ({ body, locals }) => {
		const title = body.get('title');
		const content = body.get('content');

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

		return {
			status: 302,
			redirect: `/posts/${post.slug}`
		};
	};

	export const loader: Loader<LoadedData, Locals> = ({ locals }) => {
		if (!locals.session.data?.isLoggedIn) {
			return {
				status: 302,
				redirect: '/auth/login'
			};
		}

		return {};
	};


  
  export const get = getHandler({
    hasMeta: false,
    loader: loader,
    metadata: () => ({})
  });
  

  
  export const post = postHandler({
    action: action,
  });  
  
