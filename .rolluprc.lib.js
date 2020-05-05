import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import {string} from "rollup-plugin-string";
import {terser} from "rollup-plugin-terser";

import pkg from "./package.json";

const extensions = [".ts"];
const include = "src/**/*";
const exclude = "node_modules/**";

const output = file => ({
  file,
  exports: "named",
  sourcemap: true,
});

const outputUMD = (file = "index") => ({
  ...output(`lib/${file}.umd.js`),
  name: pkg.name,
  format: "umd",
});

const outputESM = (file = "index") => ({
  ...output(`lib/${file}.esm.js`),
  format: "es",
});

const plugins = [
  resolve({extensions}),
  babel({
    include,
    exclude,
    extensions,
  }),
  string({
    include: include + ".css",
    exclude,
  }),
  terser({
    output: {
      comments: () => false,
    },
  }),
];

const components = ["number-field"];

export default components
  .map(component => ({
    input: `src/${component}`,
    output: [outputUMD(component), outputESM(component)],
    plugins,
  }))
  .concat([
    {
      input: "src",
      output: [outputUMD(), outputESM()],
      plugins,
    },
  ]);
