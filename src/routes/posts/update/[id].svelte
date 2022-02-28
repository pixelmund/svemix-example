<script context="module" lang="ts" ssr>
	import { Action, Loader, redirect } from 'svemix/server';
	import type { Post } from '@prisma/client';
	import db from '$lib/db';
	import { updatePost } from '$lib/posts';

	interface LoaderData {
		post: Post;
	}

	export const action: Action = async ({ request, locals, params }) => {
		if (!locals.session.data?.isLoggedIn) {
			return redirect('/auth/login', 302);
		}

		try {
			const body = await request.formData();

			const title = body.get('title') as string;
			const content = (body.get('content') as string) || '';

			if (!title || title.length === 0) {
				return {
					errors: {
						content: '',
						title: 'Please provide a title'
					}
				};
			}

			const post = await updatePost({
				title,
				content,
				userId: locals.session.data.user.id,
				postId: params.id
			});

			return redirect(`/posts/${post.slug}`, 302);
		} catch (error) {
			throw new Error(error);
		}
	};

	export const loader: Loader = async function ({ params, locals }) {
		if (!locals.session.data?.isLoggedIn) {
			return redirect('/auth/login', 302);
		}

		try {
			const post = await db.post.findFirst({
				where: { id: params.id, userId: locals.session.data.user.id },
				rejectOnNotFound: false
			});

			if (!post) {
				// TODO: Once Custom-Errors are implemented, change this
				throw new Error('Post not found');
			}

			return {
				post
			};
		} catch (error) {
			throw new Error(error);
		}
	};
</script>
