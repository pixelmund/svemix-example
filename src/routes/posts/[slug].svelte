<script context="module" lang="ts" ssr>
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
				// TODO: Once Custom-Errors are implemented, change this
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
</script>

<script lang="ts">
	export let data: LoaderData;
</script>

<h1>{data.post.title}</h1>

<div>
	{data.post.content}
</div>
