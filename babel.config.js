module.exports = {
  presets: [["@babel/preset-typescript", {allExtensions: true}]],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
  ],
};
