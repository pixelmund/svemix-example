import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import svemix from 'vite-plugin-svemix';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			plugins: [
				svemix({
					seoDefaults: {
						title: 'Svemix Example',
						description: 'This is the svemix blog example',
						keywords: 'svemix,example,blog'
					}
				})
			]
		}
	}
};

export default config;
