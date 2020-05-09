import commonjs from "@rollup/plugin-commonjs";
import html from "rollup-plugin-generate-html-template";

import {buildDir, extensions, outputESM, plugins} from "./.rolluprc.common.js";

export default {
  input: "src/_demo/demo.ts",
  output: outputESM(),
  plugins: plugins([
    commonjs({extensions}),
    html({
      template: "src/_demo/index.html",
      target: `${buildDir}/index.html`,
      attrs: [`type="module"`],
    }),
  ]),
};
