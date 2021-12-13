
  
	import { authenticateUser } from '$lib/auth';
	import type { Action, Loader } from 'svemix';

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
		email: string;
		password: string;
	}

	export const action: Action<ActionData> = async function ({ body, locals }) {
		const email = body.get('email');
		const password = body.get('password');

		try {
			const { user, errors } = await authenticateUser(email, password);

			if (errors.email || errors.password) {
				return {
					errors
				};
			}

			delete user?.passwordHash;

			locals.session.data = { isLoggedIn: true, user };
		} catch (error) {
			return {
				formError: error.message
			};
		}

		return {
			data: {
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

    let _metadata = {};

    

    const loadedProps = loaded?.props || {};
    const metaProps = {  }

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
  
