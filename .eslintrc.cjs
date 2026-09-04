module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    // MUI's renderOption pattern destructures `key` out of `props` solely to keep it
    // out of the `...rest` spread (React forbids spreading `key`); the var itself is
    // never read. ignoreRestSiblings covers that pattern without needing `_`-prefixing.
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
}
