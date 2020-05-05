import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import {string} from "rollup-plugin-string";
import {terser} from "rollup-plugin-terser";

import pkg from "./package.json";

const extensions = [".ts"];
const components = ["number-field"];
const plugins = [
  resolve({extensions}),
  babel({
    include: ["src/**/*"],
    exclude: "node_modules/**",
    extensions,
  }),
  string({
    include: "src/**/*.css",
    exclude: "node_modules/**",
  }),
  terser({
    output: {
      comments: () => false,
    },
  }),
];

export default components
  .map(component => ({
    input: `src/${component}`,
    output: [
      {
        file: `lib/${component}/index.umd.js`,
        name: pkg.name,
        format: "umd",
        exports: "named",
        sourcemap: true,
      },
      {
        file: `lib/${component}/index.esm.js`,
        format: "es",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins,
  }))
  .concat([
    {
      input: "src",
      output: [
        {
          file: pkg.main,
          name: pkg.name,
          format: "umd",
          exports: "named",
          sourcemap: true,
        },
        {
          file: pkg.module,
          format: "es",
          exports: "named",
          sourcemap: true,
        },
      ],
      plugins,
    },
  ]);
