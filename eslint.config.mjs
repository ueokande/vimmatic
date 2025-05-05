import globals from "globals";
import js from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import stylex from "@stylexjs/eslint-plugin";
import tseslint from "typescript-eslint";

const ignoreConfig = {
  ignores: ["**/*.d.ts", "./dist/**/*.js"],
};

const mainConfig = {
  ignores: ["scripts/**/*.mjs"],
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: {
    react,
    "@stylexjs": stylex,
  },
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-restricted-exports": [
      "error",
      {
        restrictDefaultExports: {
          direct: true,
          named: true,
        },
      },
    ],
    "no-console": "error",
  },
};

const scriptConfig = {
  files: ["script/**/*.mjs"],
  rules: {
    "no-console": "off",
  },
};

const eslintConfig = {
  files: ["./eslint.config.mjs"],
  rules: {
    "no-restricted-exports": "off",
  },
};

export default tseslint.config(
  ignoreConfig,
  js.configs.recommended,
  tseslint.configs.recommended,
  mainConfig,
  prettierRecommended,
  scriptConfig,
  eslintConfig,
);
