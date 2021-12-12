<script context="module" lang="ts" ssr>
	import { authenticateUser } from '$lib/auth';
	import type { Action, Loader } from 'svemix';

	export const loader: Loader<any, Locals> = function ({ locals }) {
		if (locals.session.data.isLoggedIn) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {};
	};

	interface ActionData {
		email: string;
		password: string;
	}

	export const action: Action<ActionData> = async function ({ body, locals }) {
		const email = body.get('email');
		const password = body.get('password');

		try {
			const { user, errors } = await authenticateUser(email, password);

			if (errors.email || errors.password) {
				return {
					errors
				};
			}

			locals.session.data = { isLoggedIn: true, user };
		} catch (error) {
			return {
				errors: {
					formError: error.message
				}
			};
		}

		return {
			data: {
				email,
				password
			}
		};
	};
</script>

<script lang="ts">
	import Form from 'svemix/Form.svelte';
</script>

<div class="max-w-xl w-full bg-gray-50 p-4 mt-8 mx-auto">
	<Form let:data let:errors let:formError let:loading on:submit={(e) => console.log(e.detail)}>
		<label class="block w-full">
			<input
				class="w-full py-3 px-3 rounded-md"
				autocomplete="email"
				placeholder="E-Mail"
				type="email"
				name="email"
				value={data?.email || ''}
			/>
			{#if errors?.email}
				<p class="text-red-600 text-sm mt-2">
					{errors.email}
				</p>
			{/if}
		</label>
		<label class="block">
			<input
				class="w-full py-3 px-3 rounded-md"
				autocomplete="new-password"
				type="password"
				name="password"
				value={data?.password || ''}
			/>
			{#if errors?.password}
				<p class="text-red-600 text-sm mt-2">
					{errors.password}
				</p>
			{/if}
		</label>
		<button
			class="w-full py-2 text-center bg-indigo-400 text-white font-semibold uppercase rounded-md"
			type="submit">Sign in</button
		>
	</Form>
</div>
