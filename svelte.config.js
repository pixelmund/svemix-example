import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import svemix from 'svemix/plugin';

/** @type {import('svemix').SvemixConfig} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({})
	],

	kit: {
		adapter: adapter(),
		vite: {
			plugins: [
				svemix()
			]
		}
	},
	svemix: {
		seo: {
			title: 'Svemix Example',
			description: 'This is the svemix blog example',
			keywords: 'svemix,example,blog',
		}
	}
};

export default config;
