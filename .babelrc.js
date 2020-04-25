module.exports = {
  presets: [
    ["@babel/preset-env", {exclude: ["babel-plugin-transform-classes"]}],
    ["@babel/preset-typescript"],
  ],
  plugins: [["@babel/plugin-proposal-decorators", {legacy: true}]],
};
