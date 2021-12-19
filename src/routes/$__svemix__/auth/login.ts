
  import { getHandler, postHandler } from "svemix/server";

  
	import { authenticateUser } from '$lib/auth';
	import type { Action } from 'svemix/server';

	interface ActionData {
		email?: string;
		password?: string;
	}

	export const action: Action<ActionData> = async function ({ body, locals }) {
		const email = body.get('email');
		const password = body.get('password');

		try {
			const { user, errors } = await authenticateUser(email, password);

			if (errors.email || errors.password) {
				return {
					data: {
						email,
						password
					},
					errors: {
						email: errors.email,
						password: errors.password
					}
				};
			}

			delete user?.passwordHash;

			locals.session.data = { isLoggedIn: true, user };

			return {
				data: {
					isLoggedIn: true,
					user
				}
			};
		} catch (error) {
			return {
				data: {
					email,
					password
				},
				formError: error.message
			};
		}
	};


  

  
  export const post = postHandler({
    action: action,
  });  
  
