// eslint.config.js
import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import globals from "globals";

import tseslint from "typescript-eslint";

// React plugins (required for JSX rules)
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  //
  // IGNORED FILES
  //
  {
    ignores: [
      "dist/**/*",
      "node_modules/**/*",
      "coverage/**/*",
      "build/**/*",
      "**/*.d.ts",
      "*.config.js",
      "*.config.mjs",
      "test/**/*",
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
        sourceType: "module",
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
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      //--------------------------------------------------------------------
      // EXISTING RULES YOU ALREADY HAD
      //--------------------------------------------------------------------
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/require-await": "warn",

      //--------------------------------------------------------------------
      // REACT RULES
      //--------------------------------------------------------------------
      "react/jsx-pascal-case": ["error"],

      // Ensures <Component /> uses PascalCase
      "react/display-name": "off",

      //--------------------------------------------------------------------
      // REACT HOOKS RULES (required)
      //--------------------------------------------------------------------
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      //--------------------------------------------------------------------
      // NAMING CONVENTIONS
      //--------------------------------------------------------------------
      // Enforce camelCase
      camelcase: [
        "error",
        {
          properties: "always",
          ignoreDestructuring: false,
        },
      ],

      // Enforce handler naming: handleXxx
      "@typescript-eslint/naming-convention": [
        "error",

        // Interfaces must be PascalCase and NOT start with I (no ICustomer)
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: false,
          },
        },

        // Variables, functions: camelCase or PascalCase
        {
          selector: ["variable", "function"],
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
      ],

      // Enforce onClick={handleClick} pattern
      "react/jsx-handler-names": [
        "error",
        {
          eventHandlerPrefix: "on",
          handlerPrefix: "handle",
        },
      ],

      //--------------------------------------------------------------------
      // REACT REFRESH (Vite / CRA)
      //--------------------------------------------------------------------
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
