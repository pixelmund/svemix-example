<script context="module" lang="ts" ssr>
	import { authenticateUser } from '$lib/auth';
	import type { Action } from 'svemix/server';
	import type { User } from '@prisma/client';

	interface ActionData {
		email?: string;
		password?: string;
		isLoggedIn?: boolean;
		user?: User;
	}

	export const action: Action<ActionData> = async function ({ body, locals }) {
		const email = body.get('email');
		const password = body.get('password');

		try {
			const { user, errors } = await authenticateUser(email, password);

			if (errors.email || errors.password) {
				return {
					data: {
						email,
						password
					},
					errors
				};
			}

			delete user?.passwordHash;

			locals.session.data = { isLoggedIn: true, user };

			return {
				data: {
					isLoggedIn: true,
					user
				}
			};
		} catch (error) {
			return {
				data: {
					email,
					password
				},
				formError: error.message
			};
		}
	};
</script>

<script lang="ts">
	import { Form } from 'svemix';
</script>

<Form
	validate={(data) => {
		return {
			email: data.email.length === 0 ? 'Required field' : '',
			password: data.password.length < 6 ? 'Password must be 6 chars long' : ''
		};
	}}
	class="space-y-6"
>
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
