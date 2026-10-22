import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  ignores: ['.vscode/**'],
}, {
  rules: {
    // describe blocks are named after PascalCase components
    'test/prefer-lowercase-title': 'off',
  },
})
