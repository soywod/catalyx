import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import {string} from "rollup-plugin-string";
import html from "rollup-plugin-generate-html-template";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const buildDir = "lib";
const extensions = [".js", ".ts"];

export default {
  input: "src/_demo/app.ts",
  output: {
    file: `${buildDir}/app.js`,
    target: "es",
  },
  plugins: [
    resolve({extensions}),
    babel({extensions, include: "src/**", exclude: "node_modules/**"}),
    commonjs({extensions}),
    string({
      include: "src/**/*.css",
      exclude: "node_modules/**",
    }),
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
  ],
};
