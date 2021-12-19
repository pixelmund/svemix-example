
  import { getHandler, postHandler } from "svemix/server";

  
	import { hashPassword } from '$lib/auth';
	import type { Action } from 'svemix/server';
	import db from '$lib/db';

	interface ActionData {
		username?: string;
		email?: string;
		password?: string;
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
					email: 'User with given E-Mail already exists',
					password: '',
					username: ''
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

			return {};
		} catch (error) {
			return {
				data: {
					username,
					email,
					password
				},
				errors: {
					username: 'Username already exists',
					email: '',
					password: ''
				}
			};
		}
	};


  

  
  export const post = postHandler({
    action: action,
  });  
  
