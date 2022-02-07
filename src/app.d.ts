/// <reference types="@sveltejs/kit" />

interface SessionData {
	isLoggedIn: boolean;
	user: Pick<import('@prisma/client').User, 'id' | 'email' | 'username'>
}

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	interface Locals {
		session: import('svemix/session').Session<SessionData>;
	}

	interface Platform {}

	interface Session extends SessionData {}

	interface Stuff {}
}
