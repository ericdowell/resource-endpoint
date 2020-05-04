module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,
  },
  plugins: [
    'import',
    'jest',
    'prettier',
    '@typescript-eslint',
  ],
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:jest/all',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier/standard',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    'import/first': 'error',
    'import/no-unresolved': ['error', {ignore: ['./','../']}],
    'jest/lowercase-name': [
      'error',
      {
        'ignore': ['describe']
      }
    ],
    'jest/prefer-inline-snapshots': ['warn'],
    'no-eval': 'error',
    '@typescript-eslint/member-delimiter-style': ['error', {
      "multiline": {
        "delimiter": "none",
        "requireLast": false,
      },
      "singleline": {
        "delimiter": "semi",
        "requireLast": false,
      }
    }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/promise-function-async': ['error'],
    '@typescript-eslint/semi': ['error', 'never']
  },
}
