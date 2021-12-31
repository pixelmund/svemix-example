<script context="module" lang="ts" ssr>
	import { authenticateUser } from '$lib/auth';
	import type { Action } from 'svemix/server';

	interface ActionData {
		email?: string;
		password?: string;
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
					errors: {
						email: errors.email,
						password: errors.password
					}
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
	let:formError
	let:errors
	let:loading
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
			{#if loading}
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
			Sign in
		</button>
	</div>
	{#if formError && formError.length > 0}
		<p class="text-red-500 text-xs mt-3 font-semibold">{formError}</p>
	{/if}
</Form>
