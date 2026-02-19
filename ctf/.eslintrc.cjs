module.exports = {
  root: true,
  ignorePatterns: ["**/dist/**", "**/.next/**", "**/.expo/**", "**/node_modules/**"],
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: ["eslint:recommended"],
};
