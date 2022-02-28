<script context="module" lang="ts" ssr>
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
</script>

<script lang="ts">
	import { Form } from 'svemix';

	function validate(formData: FormData) {
		const email = (formData.get('email') as string) || '';
		const password = (formData.get('password') as string) || '';
		return {
			email: email.length === 0 ? 'Required field' : '',
			password: password.length < 6 ? 'Password must be 6 chars long' : ''
		};
	}
</script>

<Form let:data let:submitting {validate}>
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
