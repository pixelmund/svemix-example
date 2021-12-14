
  
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
			return {
				redirect: '/',
				status: 302
			};
		}

		return {};
	};

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

    if(loaded?.error || loaded?.redirect){
      return {
        headers: loaded?.headers || {},
        body: {  
          props: { _metadata: {} },  
          error: loaded?.error,
          status: loaded?.status,
          redirect: loaded?.redirect,
          maxage: loaded?.maxage    
        }
      }
    }

    let _metadata = {};

    

    const loadedProps = loaded?.props || {};
    const metaProps = { _metadata }

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
  

  
  export const post = async function(params){
    //@ts-ignore
    const loaded = await action(params) as unknown as __Action_Result

    // This is a browser fetch
    if(params.headers && params.headers?.accept === 'application/json'){
      return {
        headers: loaded?.headers || {},
        body: {
          redirect: loaded?.redirect,
          formError: loaded?.formError,
          data: loaded?.data,  
          errors: loaded?.errors,
          status: loaded?.status,
        }
      }
    } 

    // This is the default form behaviour, navigate back to form submitter
    if(!loaded?.redirect){
      return {
        headers: {
          ...(loaded?.headers || {}),
          'Location': params.headers?.referer
        },
        status: loaded?.status || 302,
        body: {}
      }
    }

    return {
      headers: {
        ...(loaded?.headers || {}),
        'Location': loaded?.redirect,
      },
      status: loaded?.status || 302,
      body: {}
    }
  }
  
