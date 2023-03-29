const isDEV = process.env.NODE_ENV === "development"
module.exports = {
	/**预设执行顺序由右到左，所以先处理ts，再处理jsx,最后再试一下babel转换为低版本语法 */
	presets: [
		[
			"@babel/preset-env",
			{
				/**设置兼容目标浏览器版本，此处可以不写，babel-loader会自动寻找.browserslistrc文件*/
				// target: {
				//   chrome: 35,
				//   ie: 9,
				// },
				/**根据配置的浏览器兼容以及代码中使用的api进行引入polyfill按需添加*/
				useBuiltIns: "usage",
				/**配置使用core-js低版本*/
				corejs: 3
			}
		],
		[
			"@babel/preset-react",
			{
				runtime: "automatic"
			}
		],
		"@babel/preset-typescript"
	],
	plugins: [
		/**如果为开发模式则启动react热更新模块*/
		isDEV && require.resolve("react-refresh/babel"),
		["@babel/plugin-proposal-decorators", { legacy: true }]
	].filter(Boolean)
}
