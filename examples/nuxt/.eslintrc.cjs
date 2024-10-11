/* eslint-env node */
const OFF = 0;

module.exports = {
  extends: [
    '../../.eslintrc.cjs',
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "vue/multi-word-component-names": OFF,
  }
}
