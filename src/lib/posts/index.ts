import db from '$lib/db';
import { readingTime, slugify, truncateString } from './utils';

interface CreatePostInput {
	title: string;
	content: string;
	userId: string;
}

export async function createPost({ title, content, userId }: CreatePostInput) {
	const slug = slugify(title);
	const excerpt = truncateString(content, 150);
	const readTime = readingTime(content);

	const post = await db.post.create({
		data: {
			content,
			slug,
			read_time: readTime,
			excerpt,
			title,
			user: { connect: { id: userId } }
		}
	});

	return post;
}

interface UpdatePostInput {
	postId: string;
	title: string;
	content: string;
	userId: string;
}

export async function updatePost({ title, content, userId, postId }: UpdatePostInput) {
	const slug = slugify(title);
	const excerpt = truncateString(content, 150);
	const readTime = readingTime(content);

	const post = await db.post.findFirst({ where: { id: postId, userId } });

	if (!post) {
		throw new Error('Post not found!');
	}

	return await db.post.update({
		where: {
			id: postId
		},
		data: {
			content,
			slug,
			read_time: readTime,
			excerpt,
			title
		}
	});
}
