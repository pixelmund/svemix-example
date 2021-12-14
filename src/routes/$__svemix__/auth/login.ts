
  
	import { authenticateUser } from '$lib/auth';
	import type { Action } from 'svemix/server';
	import type { User } from '@prisma/client';

	interface ActionData {
		email?: string;
		password?: string;
		isLoggedIn?: boolean;
		user?: User;
	}

	export const action: Action<ActionData> = async function ({ body, locals }) {
		const email = body.get('email');
		const password = body.get('password');

		try {
			const { user, errors } = await authenticateUser(email, password);

			if (errors.email || errors.password) {
				return {
					data: {
						email,
						password
					},
					errors
				};
			}

			delete user?.passwordHash;

			locals.session.data = { isLoggedIn: true, user };

			return {
				data: {
					isLoggedIn: true,
					user
				}
			};
		} catch (error) {
			return {
				data: {
					email,
					password
				},
				formError: error.message
			};
		}
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
  
