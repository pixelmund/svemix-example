import { get as __get, post as __post } from 'svemix/server';

import { hashPassword } from '$lib/auth';
import type { Action } from 'svemix/server';
import db from '$lib/db';

export const action: Action = async function ({ request, locals }) {
	const body = await request.formData();

	const username = body.get('username') as string;
	const email = body.get('email') as string;
	const password = body.get('password') as string;

	const values = {
		username,
		email,
		password
	};

	const errors = {
		email: '',
		password: '',
		username: ''
	};

	const user = await db.user.findUnique({ where: { email } });

	if (user) {
		errors.email = 'User with given E-Mail already exists';
		return {
			values,
			errors
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
		errors.username = 'Username already exists';
		return {
			values,
			errors
		};
	}
};

export const get = __get(() => ({}));
export const post = __post(action);
