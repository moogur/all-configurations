module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.vue'],
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
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
  ],
  root: true,
  env: {
    node: true,
    browser: true,
  },
  ignorePatterns: ['.eslintrc.json', 'node_modules', 'scripts', 'src/vite-env.d.ts', 'src/**/*.vue'],
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
    'no-undefined': 'off',
    'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],

    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          '{}': false,
        },
        extendDefaults: true,
      },
    ],

    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', ['sibling', 'index'], 'type', 'object'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        'newlines-between': 'always',
      },
    ],

    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prevent-abbreviations': ['error', { checkFilenames: false }],
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],

    'optimize-regex/optimize-regex': 'warn',
    'sonarjs/cognitive-complexity': ['error', 30],
    'no-loops/no-loops': 2,
    'no-use-extend-native/no-use-extend-native': 2,
  },
};
