import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"
import { importX } from "eslint-plugin-import-x"
import pluginReact from "eslint-plugin-react"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  js.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver()],
      react: {
        version: "detect",
      },
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",

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
          pathGroups: [
            {
              pattern: "#/**",
              group: "internal",
            },
          ],
          groups: [
            "builtin",
            "external",
            ["internal", "parent", "sibling"],
            "index",
          ],
          "newlines-between": "always",
          distinctGroup: true,
          alphabetize: {
            order: "asc",
            orderImportKind: "asc",
          },
        },
      ],

      "no-unused-vars": "off",

      "react/no-children-prop": "off",
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
])
