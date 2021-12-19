<script context="module" lang="ts" ssr>
	import type { Action, Loader } from 'svemix/server';
	import { readingTime, truncateString, slugify } from '$lib/post';
	import db from '$lib/db';

	interface LoadedData {}

	interface ActionData {
		title: string;
		content: string;
	}

	export const action: Action<ActionData, Locals> = async ({ body, locals }) => {
		const title = body.get('title');
		const content = body.get('content');

		if (!title || title.length === 0) {
			return {
				errors: {
					content: '',
					title: 'Please provide a title'
				}
			};
		}

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
				user: { connect: { id: locals.session.data.user.id } }
			}
		});

		return {
			status: 302,
			redirect: `/posts/${post.slug}`
		};
	};

	export const loader: Loader<LoadedData, Locals> = ({ locals }) => {
		if (!locals.session.data?.isLoggedIn) {
			return {
				status: 302,
				redirect: '/auth/login'
			};
		}

		return {};
	};
</script>

<script>
	import { Form } from 'svemix';
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-lg">
		<h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900">New Post</h2>
	</div>
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-all duration-200">
			<Form class="space-y-6">
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
					<div class="mt-1">
						<input
							id="title"
							name="title"
							type="text"
							required
							class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
				</div>
				<div>
					<label for="content" class="block text-sm font-medium text-gray-700">Content</label>
					<div class="mt-1">
						<textarea
							id="content"
							name="content"
							type="text"
							required
							rows={6}
							class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
				</div>
				<div>
					<button
						type="submit"
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Create post
					</button>
				</div>
			</Form>
		</div>
	</div>
</div>
