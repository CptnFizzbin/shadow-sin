import js from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"
import { defineConfig } from "eslint/config"
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"
import checkFile from "eslint-plugin-check-file"
import { importX } from "eslint-plugin-import-x"
import pluginReact from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  js.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: false,
    jsx: true,
    arrowParens: true,
    braceStyle: "1tbs",
  }),
  {
    plugins: {
      "check-file": checkFile,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver()],
      "react": {
        version: "detect",
      },
    },
    rules: {
      ...{ // eslint-plugin-check-file rules
        "check-file/filename-naming-convention": [
          "error",
          {
            "**/*.{ts,tsx}": "CAMEL_CASE",
          },
          {
            ignoreMiddleExtensions: true,
          },
        ],
      },

      ...{ // builtin eslint rules
        "default-case": "error",
        "default-case-last": "error",
        "eqeqeq": ["error", "always"],
        "max-classes-per-file": ["error", 1],
        "max-depth": ["error", 4],
        "no-eval": "error",
        "no-inner-declarations": "error",
        "no-shadow": "error",
        "no-unused-vars": "off",
        "require-await": "error",
        "unicode-bom": ["error", "never"],
      },

      ...{ // @typescript-eslint rules
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-unused-vars": ["error", {
          ignoreRestSiblings: true,
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        }],

        "no-redeclare": "off", // conflicts with TypeScript's function overloads
      },

      ...{ // eslint-plugin-import-x rules
        "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "import-x/default": "off",
        "import-x/extensions": ["error", "ignorePackages", { fix: true }],
        "import-x/no-cycle": "error",
        "import-x/no-named-as-default-member": "off",
        "import-x/first": "error",
        "import-x/newline-after-import": "error",
        "import-x/no-duplicates": "error",
        "import-x/order": [
          "error",
          {
            "pathGroups": [
              {
                pattern: "#/**",
                group: "internal",
              },
            ],
            "groups": [
              "builtin",
              "external",
              ["internal", "parent", "sibling"],
              "index",
            ],
            "newlines-between": "always",
            "distinctGroup": true,
            "alphabetize": {
              order: "asc",
              orderImportKind: "asc",
            },
          },
        ],
      },

      ...{ // eslint-plugin-react rules
        "react/no-children-prop": "off",
        "react/no-unescaped-entities": "off",
        "react/react-in-jsx-scope": "off",
      },

      ...{ // @stylistic rules
        "@stylistic/jsx-one-expression-per-line": "off",
        "@stylistic/operator-linebreak": [
          "error", "before", {
            overrides: {
              "=": "after",
              "+=": "after",
              "-=": "after",
              "*=": "after",
            },
          }],
      },
    },
  },
  {
    files: [
      "src/routes/**",
      "src/character/migrations/**",
    ],
    rules: {
      "check-file/filename-naming-convention": "off",
    },
  },
  {
    files: [
      "./vite.config.ts",
      "./vitest.config.ts",
      "./eslint.config.ts",
      "./playwright.config.ts",
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
])
