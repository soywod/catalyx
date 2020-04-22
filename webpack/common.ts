import path from "path";
import webpack from "webpack";
import {CleanWebpackPlugin} from "clean-webpack-plugin";

export const rootPath = path.resolve(__dirname, "..");
export const resolveExts = [".js", ".ts"];
export const rules: webpack.RuleSetRule[] = [
  {
    test: /\.ts$/,
    use: "babel-loader",
    exclude: /node_modules/,
  },
  {
    test: /\.(html|css)$/,
    use: "raw-loader",
  },
];
export const plugins: webpack.Plugin[] = [new CleanWebpackPlugin()];

export default {
  rootPath,
  rules,
  resolveExts,
  plugins,
};
