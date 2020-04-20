import path from "path"
import webpack from "webpack"
import {CleanWebpackPlugin} from "clean-webpack-plugin"
import DotenvPlugin from "dotenv-webpack"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"

import common from "./common"
import production from "./production.lib"

const config: webpack.Configuration = {
  ...production,
  entry: path.join(common.rootPath, "src/_demo/app.tsx"),
  plugins: [
    new CleanWebpackPlugin(),
    new DotenvPlugin({systemvars: true}),
    new MiniCssExtractPlugin({filename: "creator.min.css"}),
    new HtmlWebpackPlugin({template: path.join(common.rootPath, "src/_demo/index.html")}),
  ],
}

export default config
