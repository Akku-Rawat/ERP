// eslint.config.js
import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

import tseslint from 'typescript-eslint';

// React plugins (required for JSX rules)
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from "eslint-plugin-unused-imports";


export default tseslint.config(
  //
  // IGNORED FILES
  //
  {
    ignores: [
      'dist/**/*',
      'node_modules/**/*',
      'coverage/**/*',
      'build/**/*',
      '**/*.d.ts',
      '*.config.js',
      '*.config.mjs',
      'test/**/*',
    ],
  },

  //
  // BASE CONFIGS
  //
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  //
  // PRETTIER CONFIG
  //
  prettier,

  //
  // LANGUAGE SETTINGS
  //
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  //
  // MAIN RULESET + PLUGINS
  //
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },

    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],

      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          // varsIgnorePattern: '^_',
          args: 'after-used',
          // argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-unused-vars': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/require-await': 'warn',

      'react/jsx-pascal-case': 'error',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      camelcase: ['error', { properties: 'always', ignoreDestructuring: false }],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        {
          selector: ['variable', 'function'],
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
      ],

      'react/jsx-handler-names': ['error', { eventHandlerPrefix: 'on', handlerPrefix: 'handle' }],

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  }
);
