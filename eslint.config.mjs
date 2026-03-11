// @ts-check

import unusedImports from "eslint-plugin-unused-imports";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config([
  {
    ignores: ["dist/*"],
  },
  {
    plugins: { "unused-imports": unusedImports },
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs["flat/recommended"],
    ],
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "vue/html-indent": "off",
      "vue/html-self-closing": "off",
      "vue/singleline-html-element-content-newline": "off",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
