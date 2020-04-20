import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"

import common from "./common"

const config: webpack.Configuration = {
  mode: "development",
  entry: path.join(common.rootPath, "src/_demo/app.ts"),
  devtool: "eval",
  devServer: {
    contentBase: path.resolve(__dirname, "..", "build"),
    compress: true,
    port: Number(process.env.PORT || 3000),
  },
  resolve: {
    extensions: common.resolveExts,
  },
  module: {
    rules: common.rules,
  },
  plugins: [...common.plugins, new HtmlWebpackPlugin({template: "./src/_demo/index.html"})],
}

export default config
