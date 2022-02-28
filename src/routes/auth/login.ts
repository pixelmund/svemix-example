import { get as __get, post as __post } from 'svemix/server';

import { authenticateUser } from '$lib/auth';
import type { Action } from 'svemix/server';

export const action: Action = async function ({ request, locals }) {
	const body = await request.formData();

	const email = body.get('email') as string;
	const password = body.get('password') as string;

	const values = {
		email,
		password
	};

	try {
		const { user, errors } = await authenticateUser(email, password);

		if (errors.email || errors.password) {
			return {
				values,
				errors
			};
		}

		delete user?.passwordHash;

		locals.session.data = { isLoggedIn: true, user };

		return {};
	} catch (error) {
		return {
			values,
			formError: error.message
		};
	}
};

export const get = __get(() => ({}));
export const post = __post(action);
