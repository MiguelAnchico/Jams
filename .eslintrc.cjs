module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "plugin:react/js-runtime", "standard", 'eslint-config-prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
		react: {
			version: 'detect',
		}
	},
  plugins: ["react"],
  rules: {},
};
