import { get as __get, post as __post } from 'svemix/server';

import { authenticateUser } from '$lib/auth';
import type { Action } from 'svemix/server';

interface ActionData {
	email?: string;
	password?: string;
}

export const action: Action<ActionData> = async function ({ request, locals }) {
	const body = await request.formData();

	const email = body.get('email') as string;
	const password = body.get('password') as string;

	try {
		const { user, errors } = await authenticateUser(email, password);

		if (errors.email || errors.password) {
			return {
				values: {
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
			values: {
				email,
				password
			}
		};
	} catch (error) {
		return {
			values: {
				email,
				password
			},
			formError: error.message
		};
	}
};

export const get = __get(() => ({}));
export const post = __post(action);
