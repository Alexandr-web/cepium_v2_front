// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import tseslint from "typescript-eslint";

export default withNuxt([
	{
		ignores: [
			".nuxt/**",
			".output/**",
			"dist/**",
			"node_modules/**",
			"public/**",
		],
	},
	{
		files: ["app/**/*.ts", "test/**/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
		},
	},
	{
		rules: {
			quotes: ["error", "double"],
			semi: ["error", "always"],
			indent: ["error", "tab", { SwitchCase: 1 }],
			"arrow-parens": ["error", "always"],
			"comma-dangle": ["error", {
				arrays: "always-multiline",
				objects: "always-multiline",
				imports: "always-multiline",
				exports: "always-multiline",
				functions: "never",
			}],
			"eol-last": ["error", "always"],
			"vue/html-indent": ["error", "tab"],
			"vue/script-indent": ["error", "tab", { baseIndent: 0, switchCase: 1 }],
		},
		files: [
			"app/**/*.{js,ts,jsx,tsx,vue}",
			"test/**/*.{js,ts,jsx,tsx,vue}",
			"eslint.config.mjs",
			"nuxt.config.ts",
			"vitest.config.ts",
		],
	},
]);
