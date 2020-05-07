import commonjs from "@rollup/plugin-commonjs";
import html from "rollup-plugin-generate-html-template";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

import {buildDir, extensions, outputESM, plugins} from "./.rolluprc.common.js";

export default {
  input: "src/_demo/demo.ts",
  output: outputESM(),
  plugins: plugins([
    commonjs({extensions}),
    html({
      template: "src/_demo/index.html",
      target: `${buildDir}/index.html`,
    }),
    serve({
      contentBase: buildDir,
      port: process.env.PORT || 3000,
    }),
    livereload({
      watch: buildDir,
    }),
  ]),
};
