
  import { getHandler, postHandler } from "svemix/server";

  
	import type { Loader, MetaFunction } from 'svemix/server';
	import type { Post } from '@prisma/client';
	import db from '$lib/db';

	interface Props {
		post: Post;
	}

	export const loader: Loader<Props, Locals> = async function ({ params }) {
		try {

			const post = await db.post.findUnique({
				where: { slug: params.slug },
				rejectOnNotFound: false
			});

			if (!post) {
				return {
					status: 404,
					error: 'Post not found'
				};
			}

			return {
				props: {
					post
				}
			};
		} catch (error) {
			return {
				status: 500,
				error
			};
		}
	};

	export const metadata: MetaFunction<Props> = (props) => ({
		title: props?.post?.title,
		description: props?.post?.content ? props?.post?.content.slice(0, 150) : ''
	});


  
  export const get = getHandler({
    hasMeta: true,
    loader: loader,
    metadata: metadata
  });
  

  
