import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import {terser} from "rollup-plugin-terser";

import pkg from "./package.json";

const extensions = [".ts"];

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
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
  plugins: [
    resolve({extensions}),
    babel({
      include: ["src/**/*"],
      exclude: "node_modules/**",
      extensions,
    }),
    terser({
      output: {
        comments: () => false,
      },
    }),
  ],
};
