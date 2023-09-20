module.exports = {
  plugins: ['stylelint-prettier', 'stylelint-scss', 'stylelint-order', 'stylelint-config-rational-order/plugin'],
  extends: ['stylelint-config-recommended-scss'],
  rules: {
    'prettier/prettier': true,
    'block-no-empty': true,
    'max-empty-lines': 1,
    'rule-empty-line-before': ['always', { 'ignore': 'first-nested' }],
    'at-rule-empty-line-before': 'always',
    'color-hex-case': 'lower',
    'color-no-invalid-hex': true,
    'color-hex-length': 'long',
    'color-named': 'never',
    'declaration-block-no-duplicate-custom-properties': true,
    'declaration-block-no-duplicate-properties': true,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'max-nesting-depth': 5,
    'number-leading-zero': 'always',
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'unit-no-unknown': true,
    'keyframe-block-no-duplicate-selectors': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    'selector-not-notation': 'complex',
    'declaration-block-single-line-max-declarations': 0,
    'declaration-block-no-redundant-longhand-properties': true,
    'shorthand-property-no-redundant-values': true,
    'comment-no-empty': true,

    'order/properties-order': [],
    'plugin/rational-order': [
      true,
      {
        'border-in-box-model': true,
        'empty-line-between-groups': true
      }
    ]
  },
  'customSyntax': 'postcss-scss',
  'overrides': [
    {
      'files': ['**/*.vue'],
      'customSyntax': 'postcss-html'
    }
  ]
};