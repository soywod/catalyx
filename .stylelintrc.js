module.exports = {
  extends: ["stylelint-config-recommended", "./node_modules/prettier-stylelint/config.js"],
  plugins: ["stylelint-order", "stylelint-prettier"],
  rules: {
    "at-rule-no-unknown": false,
    "no-descending-specificity": false,
    "order/order": ["custom-properties", "declarations"],
    "order/properties-alphabetical-order": true,
    "prettier/prettier": true,
    "selector-type-no-unknown": false,
  },
};
