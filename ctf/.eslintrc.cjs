module.exports = {
  root: true,
  ignorePatterns: ["**/dist/**", "**/.next/**", "**/.expo/**", "**/node_modules/**"],
  env: {
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    complexity: ["warn", 10],
    "max-lines-per-function": [
      "warn",
      {
        max: 200,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      env: {
        browser: true,
      },
    },
    {
      files: [
        "**/*.test.{ts,tsx,js,jsx}",
        "**/*.spec.{ts,tsx,js,jsx}",
        "**/*.stories.{ts,tsx,js,jsx}",
      ],
      rules: {
        complexity: "off",
        "max-lines-per-function": "off",
      },
    },
  ],
};
