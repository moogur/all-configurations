module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'unicorn',
    'import',
    'optimize-regex',
    'sonarjs',
    'no-loops',
    'promise',
    'no-use-extend-native',
    'lodash',
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    "plugin:lodash/recommended",
  ],
  root: true,
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ['.eslintrc.json', 'node_modules', 'scripts', 'd.ts', 'src/migrations'],
  settings: {
    'import/ignore': ['node_modules'],
  },
  rules: {
    'no-debugger': 'off',
    'no-console': 0,
    'no-plusplus': 'off',
    allowShortCircuit: 'off',
    allowTernary: 'off',
    eqeqeq: ['error', 'always'],
    'class-methods-use-this': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-undefined': 'error',
    'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],

    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          ['sibling', 'index'],
          'type',
          'object'
        ],
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': false
        },
        'newlines-between': 'always'
      }
    ],

    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prevent-abbreviations': ['error', { 'checkFilenames': false }],
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    // enable only with nestjs
    'unicorn/prefer-module': 'off',
    'unicorn/filename-case': ['error', { cases: { camelCase: true } }],

    'optimize-regex/optimize-regex': 'warn',
    'sonarjs/cognitive-complexity': ['error', 30],
    'no-loops/no-loops': 2,
    'no-use-extend-native/no-use-extend-native': 2,

    'lodash/import-scope': [2, "member"],
    'lodash/prefer-lodash-typecheck': 'off',
    'lodash/matches-shorthand': [2, "never"],
    "lodash/prefer-lodash-method": [2, {"ignoreObjects": ["^this.[a-zA-Z]+Repository"]}]
  },
};
