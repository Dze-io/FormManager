import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

const pkg = require('./package.json')
const banner = `/*! FormManager ${pkg.version}\n * MIT Licensed\n * https://git.delta-wings.net/dzeio/FormManager\n!*/`

export default [{
	// Umd module direct browser usage
	input: 'src/FormManager.full.ts',
	output: [
		{
			file: pkg.browser.replace(".js", ".min.js"),
			format: 'umd',
			name: 'fm',
			banner
		}, {
			file: pkg.module.replace(".js", ".min.js"),
			format: 'es',
			banner
		}
	],
	plugins: [
		typescript({
			useTsconfigDeclarationDir: true,
		}),
		babel({
			exclude: 'node_modules/**',
			plugins: ['external-helpers'],
			externalHelpers: true,
			presets : [[
				"env", {
					"targets" : {
						"browsers" : ["> 1%", "last 2 versions", "Firefox ESR", "not ie_mob <= 12"]
					},
					"modules" : false
				}
			]],
		}),
		terser(),

	]
}, {
	// Umd module direct browser usage
	input: 'src/FormManager.full.ts',
	output: [
		{
			file: pkg.browser,
			format: 'umd',
			name: 'fm',
			sourcemap: true,
			banner
		}, {
			file: pkg.module,
			format: 'es',
			sourcemap: true,
			banner
		}
	],
	plugins: [
		typescript({
			useTsconfigDeclarationDir: true,
		}),
		babel({
			exclude: 'node_modules/**'
		}),
	]
}]
