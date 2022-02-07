<script context="module" lang="ts" ssr>
	import { hashPassword } from '$lib/auth';
	import type { Action } from 'svemix/server';
	import db from '$lib/db';

	interface ActionData {
		username?: string;
		email?: string;
		password?: string;
	}

	export const action: Action<ActionData> = async function ({ request, locals }) {
		const body = await request.formData();

		const username = body.get('username') as string;
		const email = body.get('email') as string;
		const password = body.get('password') as string;

		const user = await db.user.findUnique({ where: { email } });

		if (user) {
			return {
				values: {
					username,
					email,
					password
				},
				errors: {
					email: 'User with given E-Mail already exists',
					password: '',
					username: ''
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

			return {};
		} catch (error) {
			return {
				values: {
					username,
					email,
					password
				},
				errors: {
					username: 'Username already exists',
					email: '',
					password: ''
				}
			};
		}
	};
</script>

<script lang="ts">
	import { Form } from 'svemix';
</script>

<Form
	let:errors
	let:submitting
	validate={({ data }) => {
		const email = data.get('email') || '';
		const username = data.get('password') || '';
		const password = data.get('password') || '';
		return {
			username: username.length === 0 ? 'Required Field' : '',
			email: email.length === 0 ? 'Required field' : '',
			password: password.length < 6 ? 'Password must be 6 chars long' : ''
		};
	}}
	class="space-y-4"
>
	<div class="space-y-4">
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
			{#if errors?.username && errors?.username.length > 0}
				<p class="text-red-500 text-xs mt-3 font-semibold">{errors.username}</p>
			{/if}
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
			{#if errors?.email && errors?.email.length > 0}
				<p class="text-red-500 text-xs mt-3 font-semibold">{errors.email}</p>
			{/if}
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
			{#if errors?.password && errors?.password.length > 0}
				<p class="text-red-500 text-xs mt-3 font-semibold">{errors.password}</p>
			{/if}
		</div>
		<div>
			<button
				type="submit"
				class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				{#if submitting}
					<svg
						class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				{/if}
				Sign up
			</button>
		</div>
	</div>
</Form>
