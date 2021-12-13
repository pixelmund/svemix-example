<script context="module" lang="ts" ssr>
	import db from '$lib/db';
	import type { User } from '@prisma/client';
	import type { Loader } from '@svemix/svemix';

	interface LoaderData {
		user: Pick<User, 'id' | 'username' | 'email'>;
	}

	export const loader: Loader<LoaderData, Locals> = async function ({ params }) {
		const user = await db.user.findUnique({
			where: { username: params.username },
			select: { id: true, email: true, username: true }
		});

		return {
			props: {
				user
			}
		};
	};

	export const metadata = ({ user }) => ({
		title: user?.username,
		description: 'This is a user'
	});
</script>

<script lang="ts">
	export let user: LoaderData['user'];
</script>

<h1 class="text-4xl text-center mt-8">{user?.username}</h1>
