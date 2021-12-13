
  
	import type { Loader, MetaFunction } from 'svemix';
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

  type __Loader_Result = {
    headers?: Record<string, string | string[]>;
    props?: Record<any, any>;
    error?: string | Error;
    status?: number;
    redirect?: string;
    maxage?: string;
  }

  type __Action_Result = {
    headers?: Record<string, string | string[]>;
    data?: Record<any, any>;
    errors?: Record<string, string>;
    formError?: string;
    redirect?: string;
    status?: number;
  }

  
  export const get = async function(params){
    //@ts-ignore
    const loaded = await loader(params) as unknown as __Loader_Result

    let _metadata = {};

    
    _metadata = await metadata(loaded?.props as unknown as any)
   

    const loadedProps = loaded?.props || {};
    const metaProps = {  _metadata  }

    return {
      headers: loaded?.headers || {},
      body: {  
        props: {...loadedProps, ...metaProps},  
        error: loaded?.error,
        status: loaded?.status,
        redirect: loaded?.redirect,
        maxage: loaded?.maxage    
      }
    }
  }
  

  
