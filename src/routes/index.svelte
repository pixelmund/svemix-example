<script context="module" lang="ts" ssr>
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
</script>

<script lang="ts">
	export let data: LoaderData;
</script>

<a href="/auth/login">Login</a>
<a href="/auth/register">Register</a>

<div class="posts-grid">
	{#each data.posts as post}
		<div class="post-item">
			<h3>
				{post.title}
			</h3>
			<a href="/posts/{post.slug}">View post</a>
		</div>
	{/each}
</div>

<style>
	.posts-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-top: 2rem;
	}

	h3 {
		margin-top: 0;
	}

	.post-item {
		background-color: #f4f4f4;
		padding: 1rem;
		border-radius: 0.5rem;
	}
</style>
