module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
  },
  overrides: [
    {
      files: ["**/*"],
      env: {
        mocha: true,
      },
      rules: {
        "quote-props": "off",
        "object-curly-spacing": "off",
        "max-len": "off",
        quotes: "off",
        indent: "off",
        "eol-last": "off",
        "new-cap": "off",
        camelcase: "off",
        curly: "off",
        "spaced-comment": "off",
        "require-jsdoc": "off",
      },
    },
  ],
  globals: {},
};
