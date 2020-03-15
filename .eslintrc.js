module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'prettier',
  ],
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier/standard',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    'import/first': 'error',
    'no-eval': 'error',
    'prettier/prettier': 'error',
    'import/no-unresolved': ['error', {ignore: ['@api','@errors','@/']}],
  },
}
