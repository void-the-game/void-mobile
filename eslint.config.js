const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const pluginQuery = require('@tanstack/eslint-plugin-query');
const tseslint = require('typescript-eslint');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  ...pluginQuery.configs['flat/recommended'],
  {
    ignores: ['dist/*', '.expo/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          tabWidth: 2,
        },
      ],
    },
  },
]);
