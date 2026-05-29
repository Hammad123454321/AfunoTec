import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

   {
    rules: {
      // ---- React / Hooks ----
      "react-hooks/exhaustive-deps": "off",

      // ---- TypeScript ----
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",

      // ---- Next.js ----
      "@next/next/no-img-element": "off",

      // ---- Imports ----
      "import/no-anonymous-default-export": "off",
      "import/no-unused-modules": "off",

      // ---- General JS ----
      "no-unused-vars": "off",
      "no-console": "off",
      "no-empty": "off",
    },
  }, 
];

export default eslintConfig;
