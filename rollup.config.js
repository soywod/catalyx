import ts from "@wessberg/rollup-plugin-ts";
import {terser} from "rollup-plugin-terser";

import pkg from "./package.json";

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
    ts(),
    terser({
      output: {
        comments: () => false,
      },
    }),
  ],
};
