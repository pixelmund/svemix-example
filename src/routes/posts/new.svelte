<script context="module" lang="ts" ssr>
	import { Action, Loader, redirect } from 'svemix/server';
	import { createPost } from '$lib/posts';

	export const action: Action = async ({ request, locals }) => {
		if (!locals.session.data?.isLoggedIn) {
			return redirect('/auth/login', 302);
		}

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

		const post = await createPost({ title, content, userId: locals.session.data.user.id });

		return redirect(`/posts/${post.slug}`, 302);
	};

	export const loader: Loader = ({ locals }) => {
		if (!locals.session.data?.isLoggedIn) {
			return redirect('/auth/login', 302);
		}

		return {};
	};
</script>

<script>
	import { Form } from 'svemix';
</script>
