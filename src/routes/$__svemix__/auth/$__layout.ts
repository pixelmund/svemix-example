
  import { getHandler, postHandler } from "svemix/server";

  
	import type { Loader } from 'svemix/server';

	export const loader: Loader<any, Locals> = function ({ locals }) {
		if (locals.session.data?.isLoggedIn) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {};
	};


  
  export const get = getHandler({
    hasMeta: false,
    loader: loader,
    metadata: () => ({})
  });
  

  
