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
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      env: {
        browser: true,
      },
    },
  ],
};
