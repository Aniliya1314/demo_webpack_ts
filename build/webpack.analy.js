const prodConfig = require("./webpack.prod.js")
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const { merge } = require("webpack-merge")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

const smp = new SpeedMeasurePlugin()

module.exports = smp.wrap(
	merge(prodConfig, {
		plugins: [
			/**配置分析打包结果插件*/
			new BundleAnalyzerPlugin()
		]
	})
)
