
	import db from '$lib/db';
	import type { User } from '@prisma/client';
	import type { Loader } from 'full-stack-svelte-kit';

	type LoadedUser = Pick<User, 'id' | 'email' | 'username'>;

	export const loader: Loader<{ users: LoadedUser[] }, Locals> = async function ({}) {
		const users = await db.user.findMany({ select: { username: true, email: true, id: true } });

		return {
			props: {
				users
			}
		};
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
        status?: number;
    }
    

      export const get = async function(params){
            const loaded = await loader(params) as unknown as __Loader_Result;
  
            return {
                 headers: loaded?.headers || {},
                 body: {
                   props: loaded?.props,  
                   error: loaded?.error,
                   status: loaded?.status,
                   redirect: loaded?.redirect,
                   maxage: loaded?.maxage    
                 }
             }  
         }
    