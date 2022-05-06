const parser = '@typescript-eslint/parser'
const parserOptions = {
  project: './tsconfig.json',
  sourceType: 'module',
  ecmaVersion: 2018,
}
const plugins = ['import', 'prettier', '@typescript-eslint']
const lintExtends = [
  'standard',
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:import/errors',
  'plugin:import/warnings',
  'plugin:prettier/recommended',
]
module.exports = {
  parser,
  reportUnusedDisableDirectives: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  plugins,
  extends: lintExtends,
  parserOptions,
  settings: {
    'import/resolver': 'webpack',
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    'import/first': 'error',
    'import/no-unresolved': ['error'],
    'no-eval': 'error',
    // typescript
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/promise-function-async': ['error'],
    '@typescript-eslint/semi': ['error', 'never'],
  },
  overrides: [
    {
      files: ['src/__tests__/**/*.ts?(x)'],
      parser,
      plugins: [...plugins, 'jest'],
      parserOptions,
      extends: ['plugin:jest/all', ...lintExtends],
      rules: {
        'jest/prefer-lowercase-title': [
          'error',
          {
            ignore: ['describe'],
          },
        ],
      },
    },
  ],
}
