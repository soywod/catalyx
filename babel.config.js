module.exports = api => {
  api.cache(true)

  return {
    presets: [
      ["@babel/env", {targets: "> 0.25%", useBuiltIns: "usage", corejs: "3.6.5"}],
      ["@babel/preset-typescript", {allExtensions: true}],
    ],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread",
    ],
  }
}
