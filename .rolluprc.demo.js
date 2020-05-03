import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import html from "rollup-plugin-generate-html-template";

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
    html({
      template: "src/_demo/index.html",
      target: `${buildDir}/index.html`,
    }),
  ],
};
