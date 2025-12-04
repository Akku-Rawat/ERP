import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import filenames from 'eslint-plugin-filenames';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
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

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  prettier,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
  },

  {
    plugins: {
      filenames,
      'react-refresh': reactRefresh,
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/require-await': 'warn',

      camelcase: [
        'error',
        {
          properties: 'always',
          ignoreDestructuring: false,
        },
      ],

      'react/jsx-pascal-case': [
        'error',
        {
          allowAllCaps: false,
          allowNamespace: false,
        },
      ],

      '@typescript-eslint/naming-convention': [
        'error',

        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },

        {
          selector: ['variable', 'function'],
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },

        {
          selector: 'variable',
          format: ['camelCase'],
          filter: {
            regex: '^handle[A-Z].*$',
            match: true,
          },
        },
      ],

      'react/jsx-handler-names': [
        'error',
        {
          eventHandlerPrefix: 'on',
          handlerPrefix: 'handle',
        },
      ],

      'filenames/match-regex': ['warn', '^[A-Z][a-zA-Z0-9]*$', true],

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  }
);
