<script context="module" lang="ts" ssr>
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
</script>

<script lang="ts">
	import { Form } from 'svemix';

	function validate(formData: FormData) {
		const email = (formData.get('email') as string) || '';
		const username = (formData.get('password') as string) || '';
		const password = (formData.get('password') as string) || '';
		return {
			username: username.length === 0 ? 'Required Field' : '',
			email: email.length === 0 ? 'Required field' : '',
			password: password.length < 6 ? 'Password must be 6 chars long' : ''
		};
	}
</script>

<Form let:data let:submitting {validate}>
	<div>
		<label for="username">Username</label>
		<input type="text" id="username" name="username" />
	</div>
	<div>
		<label for="email">E-Mail</label>
		<input type="email" id="email" name="email" />
	</div>
	<div>
		<label for="password">Password</label>
		<input type="password" id="password" name="password" />
	</div>
	<button type="submit">Log in</button>
</Form>

