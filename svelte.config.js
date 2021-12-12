import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import fullStackKit from 'full-stack-svelte-kit';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		}),
		fullStackKit()
	],

	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			optimizeDeps: {
				exclude: ['svelte-kit-cookie-session']
			},
			resolve: {
				alias: {
					$components: path.resolve('./src/components')
				}
			}
		}
	}
};

export default config;