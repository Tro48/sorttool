module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		warnOnUnsupportedTypeScriptVersion: false,
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:prettier/recommended',
	],
	rules: {
		'no-undef': 'off',
		'react/react-in-jsx-scope': 'off',
		'prettier/prettier': [
			'warn',
			{
				endOfLine: 'auto',
			},
		],
		'no-console': 'warn',
	},
};
