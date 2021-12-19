/// <reference types="@sveltejs/kit" />

interface Locals {
	session: import('svemix/session').PublicSession<{ user: import('@prisma/client').User, isLoggedIn: boolean }>;
}
