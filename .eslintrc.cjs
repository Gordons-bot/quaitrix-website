module.exports = {
  ignorePatterns: ['dist/', 'public/', 'node_modules/'],
  rules: {
    '@typescript-eslint/no-unused-vars': [2, {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }]
  }
};
