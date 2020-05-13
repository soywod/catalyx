import replace from "@rollup/plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import {string} from "rollup-plugin-string";

import pkg from "./package.json";

export const buildDir = "lib";
export const extensions = [".ts"];
export const include = "src/**/*";
export const exclude = "node_modules/**";

const outputBase = file => ({
  file,
  exports: "named",
  sourcemap: true,
});

export const outputUMD = (file = "index") => ({
  ...outputBase(`${buildDir}/${file}.umd.js`),
  name: pkg.name,
  format: "umd",
});

export const outputESM = (file = "index") => ({
  ...outputBase(`${buildDir}/${file}.esm.js`),
  format: "es",
});

export const output = (file = "index") => [outputUMD(file), outputESM(file)];

export const plugins = (plugins = []) =>
  [
    replace({"process.env.NODE_ENV": JSON.stringify("production")}),
    resolve({extensions}),
    babel({include, exclude, extensions}),
    string({include: include + ".{html|svg|css}", exclude}),
  ].concat(plugins);
