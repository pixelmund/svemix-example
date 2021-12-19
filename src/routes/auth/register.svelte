<script context="module" lang="ts" ssr>
	import { hashPassword } from '$lib/auth';
	import type { Action } from 'svemix/server';
	import type { User } from '@prisma/client';
	import db from '$lib/db';

	interface ActionData {
		username?: string;
		email?: string;
		password?: string;
		isLoggedIn?: boolean;
		user?: User;
	}

	export const action: Action<ActionData> = async function ({ body, locals }) {
		const username = body.get('username');
		const email = body.get('email');
		const password = body.get('password');

		const user = await db.user.findUnique({ where: { email } });

		if (user) {
			return {
				data: {
					username,
					email,
					password
				},
				errors: {
					email: 'User with given E-Mail already exists'
				}
			};
		}

		const passwordHash = await hashPassword(password);

		try {
			const newUser = await db.user.create({
				data: {
					email,
					passwordHash,
					username
				}
			});

			delete newUser?.passwordHash;

			locals.session.data = { isLoggedIn: true, user: newUser };

			return {
				data: {
					isLoggedIn: true,
					user: newUser
				}
			};
		} catch (error) {
			return {
				data: {
					username,
					email,
					password
				},
				errors: {
					username: 'Username already exists'
				}
			};
		}
	};
</script>

<script lang="ts">
	import Form from 'svemix/Form.svelte';
</script>

<Form class="space-y-4">
	<div>
		<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
		<div class="mt-1">
			<input
				id="username"
				name="username"
				type="text"
				autocomplete="username"
				required
				class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
			/>
		</div>
	</div>

	<div>
		<label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
		<div class="mt-1">
			<input
				id="email"
				name="email"
				type="email"
				autocomplete="email"
				required
				class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
			/>
		</div>
	</div>

	<div>
		<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
		<div class="mt-1">
			<input
				id="password"
				name="password"
				type="password"
				autocomplete="current-password"
				required
				class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
			/>
		</div>
	</div>
	<div>
		<button
			type="submit"
			class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			Sign in
		</button>
	</div>
</Form>
