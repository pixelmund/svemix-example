
  
	import db from '$lib/db';
	import type { User } from '@prisma/client';
	import type { Loader } from '@svemix/svemix';

	interface LoaderData {
		user: Pick<User, 'id' | 'username' | 'email'>;
	}

	export const loader: Loader<LoaderData, Locals> = async function ({ params }) {
		const user = await db.user.findUnique({
			where: { username: params.username },
			select: { id: true, email: true, username: true }
		});

		return {
			props: {
				user
			}
		};
	};

	export const metadata = ({ user }) => ({
		title: user?.username,
		description: 'This is a user'
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
  

  
