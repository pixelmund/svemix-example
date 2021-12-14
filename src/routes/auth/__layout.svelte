<script context="module" lang="ts" ssr>
	import type { Loader } from 'svemix/server';

	export const loader: Loader<any, Locals> = function ({ locals }) {
		if (locals.session.data.isLoggedIn) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {};
	};
</script>

<script lang="ts">
	import { page, navigating, session } from '$app/stores';
	import { onDestroy } from 'svelte';

	let blurred = false;
	let timeout: NodeJS.Timeout;

	// We have to subscribe to the session if we want to set it on login/register
	$: __session = $session

	$: signIn = $page.path === '/auth/login';
	$: if (
		($navigating?.from.path === '/auth/register' && $navigating?.to.path === '/auth/login') ||
		($navigating?.from.path === '/auth/login' && $navigating?.to.path === '/auth/register')
	) {
		blurred = true;
	} else {
		timeout = setTimeout(function () {
			blurred = false;
		}, 200);
	}

	onDestroy(() => {
		if (timeout) {
			clearTimeout(timeout);
		}
	});
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-lg">
		<h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900">
			{signIn ? 'Sign in' : 'Sign up'}
		</h2>
		<p class="mt-4 text-center text-base text-gray-600">
			Or
			<a
				href={signIn ? '/auth/register' : '/auth/login'}
				class="font-medium text-indigo-600 hover:text-indigo-500"
			>
				{signIn ? 'create an account' : 'log in to your account.'}
			</a>
		</p>
	</div>
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div
			class:blur-sm={blurred}
			class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-all duration-200"
		>
			<slot />
		</div>
	</div>
</div>
