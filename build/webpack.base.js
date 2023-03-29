const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const resolvePath = (url) => path.resolve(__dirname, url)
const isDev = process.env.NODE_ENV === "development"

module.exports = {
	entry: resolvePath("../src/index.tsx"),
	output: {
		/**打包结果输出路径*/
		path: resolvePath("../dist"),
		/**每个输出的js的名称*/
		filename: "static/js/[name].[chunkhash:8].js",
		/**webpack4需要配置clean-webpack-plugin来删除dist文件，webpack5内置*/
		clean: true,
		/**打包后文件的公共前缀路径*/
		publicPath: "/"
	},
	module: {
		rules: [
			{
				/**只对项目src文件夹里的ts,tsx文件进行loader解析*/
				include: [resolvePath("../src")],
				test: /\.(tsx?)$/,
				use: ["thread-loader", "babel-loader"]
			},
			{
				test: /\.(css)$/,
				use: [
					/**开发环境使用style-loader，打包模式抽离css*/
					isDev ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: ["autoprefixer"]
							}
						}
					}
				]
			},
			{
				test: /\.(less)$/,
				use: [
					/**开发环境使用style-loader，打包模式抽离css*/
					isDev ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: ["autoprefixer"]
							}
						}
					},
					"less-loader"
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				/**使用内置asset*/
				type: "asset",
				parser: {
					dataUrlCondition: {
						/**小于10kb转换为base64*/
						maxSize: 10 * 1024
					}
				},
				generator: {
					/**文件输出目录和名称*/
					filename: "static/images/[name].[contenthash:8][ext]"
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024
					}
				},
				generator: {
					filename: "static/fonts/[name].[contenthash:8][ext]"
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024
					}
				},
				generator: {
					filename: "static/media/[name].[contenthash:8][ext]"
				}
			}
		]
	},
	resolve: {
		extensions: [".js", ".tsx", ".ts"],
		/**配置别名*/
		alias: {
			"@": resolvePath("../src")
		},
		/**查找第三方模块只在本项目的node_modules中查找*/
		modules: [resolvePath("../node_modules")]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: resolvePath("../public/index.html"),
			/**自动注入静态资源*/
			inject: true
		}),
		new webpack.DefinePlugin({
			"process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV)
		})
	],
	/**开启缓存*/
	cache: {
		/**使用文件缓存方式*/
		type: "filesystem"
	}
}
