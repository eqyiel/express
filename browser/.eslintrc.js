/**
 * @format
 */

const prettierConfig = require('../.prettierrc.json');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['warn', prettierConfig],
  },
};
