<script context="module" lang="ts" ssr>
	import db from '$lib/db';
	import type { User } from '@prisma/client';
	import type { Loader } from 'svemix';

	type LoadedUser = Pick<User, 'id' | 'email' | 'username'>;

	export const loader: Loader<{ users: LoadedUser[] }, Locals> = async function ({}) {
		const users = await db.user.findMany({ select: { username: true, email: true, id: true } });

		return {
			props: {
				users
			}
		};
	};

	export const metadata = ({ users }) => ({
		title: 'All Users',
		description: 'This is a user'
	});
</script>

<script lang="ts">
	export let users: LoadedUser[] = [];
</script>

<div class="max-w-lg mx-auto w-full mt-8">
	{#if users && users.length > 0}
		{#each users as user (user.id)}
			<a class="block text-center text-lg mb-4 bg-gray-50 rounded-md p-4" href="/users/{user.username}">
				{user.username}
			</a>
		{/each}
	{/if}
</div>
