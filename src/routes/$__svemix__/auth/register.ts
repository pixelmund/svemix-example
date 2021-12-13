
  
	import { hashPassword } from '$lib/auth';
	import type { Action, Loader } from 'svemix';
	import db from '$lib/db';

	export const loader: Loader<any, Locals> = function ({ locals }) {
		if (locals.session.data.isLoggedIn) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {};
	};

	interface ActionData {
		username: string;
		email: string;
		password: string;
	}

	export const action: Action<ActionData> = async function ({ body, locals }) {
		const username = body.get('username');
		const email = body.get('email');
		const password = body.get('password');

		const user = await db.user.findUnique({ where: { email } });

		if (user) {
			return {
				data: {
					username,
					email,
					password
				},
				errors: {
					email: 'User with given E-Mail already exists'
				}
			};
		}

		const passwordHash = await hashPassword(password);

		try {
			const newUser = await db.user.create({
				data: {
					email,
					passwordHash,
					username
				}
			});

			delete newUser?.passwordHash;

			locals.session.data = { isLoggedIn: true, user: newUser };
		} catch (error) {
			return {
				data: {
					username,
					email,
					password
				},
				errors: {
					username: 'Username already exists'
				}
			};
		}

		return {
			data: {
				username,
				email,
				password
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

    return {
      headers: loaded?.headers || {},
      body: {
        formError: loaded?.formError,
        data: loaded?.data,  
        errors: loaded?.errors,
        status: loaded?.status,
      }
    }
  }
  
