<script context="module" lang="ts" ssr>
	import { hashPassword } from '$lib/auth';
	import type { Action, Loader } from 'svemix';
	import db from '$lib/db';

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
		username: string;
		email: string;
		password: string;
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

		return {
			data: {
				username,
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
				autocomplete="username"
				placeholder="Username"
				value={data?.username || ''}
				type="text"
				name="username"
			/>
			{#if errors?.username}
				<p class="text-red-600 text-sm mt-2">
					{errors.username}
				</p>
			{/if}
		</label>
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
