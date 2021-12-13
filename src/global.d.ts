/// <reference types="@sveltejs/kit" />

interface Locals {
	session: import('svemix').Session<{ user: any, isLoggedIn: boolean }>;
}
