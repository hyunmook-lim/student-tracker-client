import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
      prettier,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'prettier/prettier': 'error',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-closing-bracket-location': [1, 'line-aligned'],
      'react/jsx-indent-props': [1, 2],
      'react/jsx-indent': [1, 2],
      'react/jsx-max-props-per-line': [1, { maximum: 1, when: 'multiline' }],
      'react/jsx-first-prop-new-line': [1, 'multiline'],
      'react/jsx-closing-tag-location': 1,
      'react/jsx-curly-spacing': [1, 'never'],
      'react/jsx-equals-spacing': [1, 'never'],
      'react/jsx-no-duplicate-props': 1,
      'react/jsx-no-undef': 1,
      'react/jsx-pascal-case': 1,
      'react/jsx-sort-props': 'off',
      'react/jsx-tag-spacing': [
        1,
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never',
        },
      ],
    },
  },
]);
