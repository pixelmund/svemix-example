/// <reference types="@sveltejs/kit" />

interface Locals {
	session: import('svelte-kit-cookie-session').Session<{ user: any, isLoggedIn: boolean }>;
}
