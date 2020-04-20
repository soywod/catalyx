import path from "path"
import webpack from "webpack"

import common from "./common"

const config: webpack.Configuration = {
  mode: "production",
  entry: path.join(common.rootPath, "src/index.tsx"),
  devtool: "source-map",
  output: {
    filename: "creator.min.js",
    path: path.join(common.rootPath, "build"),
    libraryTarget: "umd",
    library: "Creator",
    umdNamedDefine: true,
  },
  resolve: {
    extensions: common.resolveExts,
  },
  module: {
    rules: [...common.rules],
  },
  plugins: [...common.plugins],
}

export default config
