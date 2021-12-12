import db from '$lib/db';
import SecurePassword from 'secure-password';

const securePassword = new SecurePassword();

/**
 * Hash a plain text password and return the hashed password.
 */
export async function hashPassword(password: string) {
	return await securePassword.hash(Buffer.from(password));
}

/**
 * Verify that a hashed password and a plain text password match.
 */
export async function verifyPassword(hashedPassword: Buffer, password: string) {
	try {
		return await securePassword.verify(Buffer.from(password), hashedPassword);
	} catch (error) {
		console.error(error);
		return SecurePassword.INVALID;
	}
}

export function passwordIsValid(validity: symbol) {
	return [SecurePassword.VALID, SecurePassword.VALID_NEEDS_REHASH].includes(validity);
}

/**
 * Attempts to authenticate a user, given their username and password.
 */
export async function authenticateUser(email: string, password: string, query?: any) {
	const user = await db.user.findFirst({
		...(query ? query : {}),
		where: {
			email: {
				equals: email
			}
		}
	});

	if (!user || !user.passwordHash) {
		return {
			user: null,
			errors: {
				email: 'Email not found',
				password: null
			}
		};
	}

	const passwordStatus = await verifyPassword(user.passwordHash, password);

	switch (passwordStatus) {
		case SecurePassword.VALID:
			break;
		case SecurePassword.VALID_NEEDS_REHASH:
			// If the password was hashed with a less-secure hash, we will seamlessly
			// upgrade it to the more secure version.
			const improvedHash = await hashPassword(password);
			await db.user.update({
				where: { id: user.id },
				data: { passwordHash: improvedHash }
			});
			break;
		default:
			return {
				user: null,
				errors: {
					email: null,
					password: 'Password is incorrect.'
				}
			};
	}

	return {
		user,
		errors: {}
	};
}
