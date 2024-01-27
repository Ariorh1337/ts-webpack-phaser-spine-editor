const path = require('path');
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: ["./src/scripts/game/index.ts"],
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].bundle.js',
		chunkFilename: '[name].chunk.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		modules: ["node_modules", "src"],
		alias: {
			'src': path.resolve(__dirname, '../src'),
			'static': path.resolve(__dirname, '../static'),
			'game': path.resolve(__dirname, '../src/scripts/game'),
			'util': path.resolve(__dirname, '../src/scripts/util')
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$|\.jsx?$/,
				include: path.join(__dirname, '../src'),
				loader: 'ts-loader'
			},
			{
				test: /\.json/,
				type: "asset/resource",
				exclude: /node_modules/,
			}
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
					filename: '[name].bundle.js'
				}
			}
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			gameName: 'Template',
			template: 'src/index.html',
			serviceWorker: `<script type="module">
					if (window.location.host && !window.location.host.includes("localhost")) {
						if ('serviceWorker' in navigator) {
							window.addEventListener('load', () => {
								navigator.serviceWorker.register('./sw.js');
							});
						}
					}
				</script>`,
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'pwa', to: '' },
				{ from: 'src/favicon.ico', to: '' },
				{
					from: "static",
					globOptions: {
						// asset pack files are imported in code as modules
						ignore: ["**/publicroot", "**/*-pack.json"]
					}
				}
			]
		}),
		new webpack.HotModuleReplacementPlugin(),
	]
}
