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
  ],
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    'import/first': 'error',
    'import/no-unresolved': ['error', {ignore: ['@api','@errors','@/']}],
    'no-eval': 'error',
    // Prettier replacements
    'arrow-parens': ["error", "always"],
    'comma-dangle': ["error", "always-multiline"],
    indent: ['error', 2],
    'max-len': ['error', { "code": 120 }],
    'object-curly-spacing': ["error", "always"],
    quotes: ["error", "single"],
    semi: 'off',
    'space-before-function-paren': ['error', 'never'],
    '@typescript-eslint/semi': ['error', 'never']
  },
}
