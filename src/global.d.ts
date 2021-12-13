/// <reference types="@sveltejs/kit" />

interface Locals {
	session: import('@svemix/svemix').Session<{ user: any, isLoggedIn: boolean }>;
}
