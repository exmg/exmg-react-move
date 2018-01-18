import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

const version = process.env.VERSION || require('./package.json').version;

const banner = `/**
 * Exmg React Move v${version}
 * (C) 2017-${new Date().getFullYear()} Niek Saarberg
 * Released under the MIT License.
 */`;

const external = [
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.devDependencies || {}),
];

const plugins = [
	resolve({
		extensions: ['.js', '.jsx'],
	}),
	commonjs({
		include: ['node_modules/**'],
	}),
	babel({
		exclude: 'node_modules/**', // only transpile our source code
		plugins: ['external-helpers'],
	}),
];

export default [
	{
		input: 'src/index.js',
		output: {
			file: pkg.module,
			format: 'es',
			banner,
			sourcemap: true,
		},
		external,
		plugins,
	},
	{
		input: 'src/index.js',
		output: {
			file: pkg.main,
			format: 'cjs',
			banner,
			sourcemap: true,
		},
		external,
		plugins,
	},
];
