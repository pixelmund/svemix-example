<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = function ({ session }) {
		if (session?.isLoggedIn) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {};
	};
</script>

<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { onDestroy } from 'svelte';

	let blurred = false;
	let timeout: NodeJS.Timeout;

	$: signIn = $page.url.pathname === '/auth/login';
	$: if (
		($navigating?.from.pathname === '/auth/register' &&
			$navigating?.to.pathname === '/auth/login') ||
		($navigating?.from.pathname === '/auth/login' && $navigating?.to.pathname === '/auth/register')
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

<h2>
	{signIn ? 'Sign in' : 'Sign up'}
</h2>
<p>
	Or
	<a href={signIn ? '/auth/register' : '/auth/login'}>
		{signIn ? 'create an account' : 'log in to your account.'}
	</a>
</p>
<slot />
