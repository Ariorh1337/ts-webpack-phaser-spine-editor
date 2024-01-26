const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require("path");

const dev = {
	mode: 'development',
	stats: 'errors-warnings',
	devtool: 'eval',
	devServer: {
		open: true,
		hot: true,
		port: 8080,
		static: {
			directory: path.resolve(__dirname, "./dist"),
		},
		allowedHosts: 'all',
		historyApiFallback: true,
	},
}

module.exports = merge(common, dev)
