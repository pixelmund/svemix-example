<script context="module" lang="ts" ssr>
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
</script>

<script lang="ts">
	export let data: Props;
</script>

<div class="relative py-16 bg-white overflow-hidden">
	<div class="relative px-4 sm:px-6 lg:px-8">
		<div class="text-lg max-w-prose mx-auto">
			<h1>
				<span
					class="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase"
					>Article</span
				>
				<span
					class="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl"
				>
					{data.post.title}
				</span>
			</h1>
			<p class="mt-8 text-xl text-gray-500 leading-8">
				{data.post.content}
			</p>
			<a
				class="mt-8 text-indigo-600 font-semibold tracking-wide uppercase block text-center hover:text-indigo-500"
				href="/">View all posts</a
			>
		</div>
	</div>
</div>
