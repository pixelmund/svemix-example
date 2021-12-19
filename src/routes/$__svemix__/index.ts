
  import { getHandler, postHandler } from "svemix/server";

  
	import type { Action, Loader } from 'svemix/server';
	import type { Post } from '@prisma/client';
	import db from '$lib/db';

	interface Props {
		posts: Post[];
	}

	export const loader: Loader<Props, Locals> = async function ({}) {
		const posts = await db.post.findMany({ take: 9, orderBy: { createdAt: 'desc' } });

		return {
			props: {
				posts
			}
		};
	};

	export const action: Action<any, any, Locals> = async function ({ locals, body }) {
		const _action = body.get('_action');

		if (_action === 'logout') {
			locals.session.destroy();
		}

		return {};
	};


  
  export const get = getHandler({
    hasMeta: false,
    loader: loader,
    metadata: () => ({})
  });
  

  
  export const post = postHandler({
    action: action,
  });  
  
