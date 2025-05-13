import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import { sveltekit } from '@sveltejs/kit/vite'
import devtoolsJSON from 'vite-plugin-devtools-json'

export default defineConfig({
	plugins: [
		deno(),
		sveltekit(),
		devtoolsJSON(),
	],
})
