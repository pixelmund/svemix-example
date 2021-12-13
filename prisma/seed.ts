import Prisma from '@prisma/client';

import SecurePassword from 'secure-password';
const securePassword = new SecurePassword();

/**
 * Hash a plain text password and return the hashed password.
 */
export async function hashPassword(password: string) {
	return await securePassword.hash(Buffer.from(password));
}

const db = new Prisma.PrismaClient({
	log: ['warn', 'info', 'query', 'error']
});

async function main() {
	const user1 = await db.user.upsert({
		where: {
			email: 'user1@gmail.com'
		},
		create: {
			email: 'user1@gmail.com',
			passwordHash: await hashPassword('123456'),
			username: 'user1'
		},
		update: {}
	});

	const posts = [
		db.post.create({
			data: {
				title: 'My first post',
				slug: 'my-first-post',
				user: { connect: { id: user1.id } },
				content:
					'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
			}
		}),
		db.post.create({
			data: {
				title: 'My second post',
				slug: 'my-second-post',
				user: { connect: { id: user1.id } },
				content:
					'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
			}
		}),
		db.post.create({
			data: {
				title: 'My third post',
				slug: 'my-third-post',
				user: { connect: { id: user1.id } },
				content:
					'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
			}
		})
	];

	await db.$transaction(posts);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
