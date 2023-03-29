const path = require("path");
const glob = require("glob");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMiniMizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const globAll = require("glob-all");

const resolvePath = (url) => path.resolve(__dirname, url);

module.exports = merge(baseConfig, {
	/**生产模式，会开启tree-shaking和压缩代码,以及其他优化*/
	mode: "production",
	optimization: {
		minimizer: [
			/**css压缩*/
			new CssMiniMizerPlugin(),
			/**js压缩*/
			new TerserPlugin({
				//开启多线程压缩
				parallel: true,
				terserOptions: {
					compress: {
						/**删除console.log*/
						pure_funcs: ["console.log"],
					},
				},
			}),
		],
		/**代码分割*/
		splitChunks: {
			cacheGroups: {
				/**提取node_modules代码*/
				vendors: {
					test: /node_modules/,
					/**提取文件命名为vendors.js后缀和chunkhash会自动加*/
					name: "vendors",
					/**只要使用一次就提取出来*/
					minChunks: 1,
					/**只提取初始化就能获取到的模块，不管异步的*/
					chunks: "initial",
					/**提取代码体积大于0就提取出来*/
					minSize: 0,
					/**提取优先级为1*/
					priority: 1,
				},
				/**提取页面公共代码*/
				commons: {
					/**提取文件命名为commons*/
					name: "commons",
					/**只要使用两次就提取出来*/
					minChunks: 2,
					chunks: "initial",
					minSize: 0,
				},
			},
		},
	},
	plugins: [
		/**复制文件插件*/
		new CopyWebpackPlugin({
			patterns: [
				{
					from: resolvePath("../public"),
					to: resolvePath("../dist"),
					/**忽略html文件*/
					filter: (source) => !source.includes("index.html"),
				},
			],
		}),
		/**抽离css插件*/
		new MiniCssExtractPlugin({
			/**抽离css的输出目录和名称*/
			filename: "static/css/[name].[contenthash:8].css",
		}),
		/**清理无用的css*/
		new PurgeCSSPlugin({
			/**检测src下所有tsx文件和public下index.html中使用的类名、id、以及标签名称*/
			paths: globAll.sync([
				`${resolvePath("../src")}/**/*.tsx`,
				resolvePath("../public/index.html"),
			]),
			safelist: {
				/**过滤以ant-开头的类名，避免删除antd组件库的前缀ant*/
				standard: [/^ant-/],
			},
		}),
		/**生成gzip压缩文件*/
		new CompressionPlugin({
			/**只生产css,js压缩文件*/
			test: /\.(css|js)$/,
			/**文件命名*/
			filename: "[path][base].gz",
			/**压缩格式，默认为gzip*/
			algorithm: "gzip",
			/**只有大小大于该值的资源才会被处理，默认为10k*/
			threshold: 10240,
			/**压缩率，默认为0.8*/
			minRatio: 0.8,
		}),
	],
});
