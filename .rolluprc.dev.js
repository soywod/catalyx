import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import html from "rollup-plugin-generate-html-template";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import sass from "rollup-plugin-sass";

const buildDir = "lib";
const extensions = [".js", ".ts"];

export default {
  input: "src/_demo/app.ts",
  output: {
    file: `${buildDir}/app.js`,
    target: "es",
  },
  external: [],
  plugins: [
    resolve({extensions}),
    babel({extensions, include: "src/**", exclude: "node_modules/**"}),
    sass(),
    html({
      template: "src/_demo/index.html",
      target: `${buildDir}/index.html`,
      attrs: [`type="module"`],
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
