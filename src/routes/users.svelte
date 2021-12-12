<script context="module" lang="ts" ssr>
	import db from '$lib/db';
	import type { User } from '@prisma/client';
	import type { Loader } from 'full-stack-svelte-kit';

	type LoadedUser = Pick<User, 'id' | 'email' | 'username'>;

	export const loader: Loader<{ users: LoadedUser[] }, Locals> = async function ({}) {
		const users = await db.user.findMany({ select: { username: true, email: true, id: true } });

		return {
			props: {
				users
			}
		};
	};
</script>

<script lang="ts">
	export let users: LoadedUser[] = [];
</script>

{#if users && users.length > 0}
	{#each users as user (user.id)}
		<div>
			{user.username}
		</div>
	{/each}
{/if}
