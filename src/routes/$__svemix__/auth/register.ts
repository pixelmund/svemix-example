
  
	import { hashPassword } from '$lib/auth';
	import type { Action } from 'svemix/server';
	import type { User } from '@prisma/client';
	import db from '$lib/db';

	interface ActionData {
		username?: string;
		email?: string;
		password?: string;
		isLoggedIn?: boolean;
		user?: User;
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

			return {
				data: {
					isLoggedIn: true,
					user: newUser
				}
			};
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
  
