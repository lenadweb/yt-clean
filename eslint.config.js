const js = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const react = require('eslint-plugin-react');
const prettier = require('eslint-plugin-prettier');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
    {
        ignores: ['node_modules/**', '.yarn/**', 'dist/**', 'release/**'],
    },
    js.configs.recommended,
    eslintConfigPrettier,
    {
        files: ['**/*.{js,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tsParser,
            globals: {
                chrome: 'readonly',
                document: 'readonly',
                globalThis: 'readonly',
                HTMLElement: 'readonly',
                HTMLButtonElement: 'readonly',
                InsertPosition: 'readonly',
                KeyboardEvent: 'readonly',
                MouseEvent: 'readonly',
                MutationObserver: 'readonly',
                Node: 'readonly',
                Promise: 'readonly',
                React: 'readonly',
                RefObject: 'readonly',
                ReturnType: 'readonly',
                Window: 'readonly',
                window: 'readonly',
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly',
            },
        },
        plugins: {
            react,
            prettier,
            '@typescript-eslint': typescriptEslint,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            'prettier/prettier': 'error',
            'react/prop-types': 'off',
            'arrow-body-style': ['error', 'as-needed'],
            'react/react-in-jsx-scope': 'off',
            'react/display-name': 'off',
            'react/self-closing-comp': [
                'error',
                {
                    component: true,
                    html: true,
                },
            ],
            'no-redeclare': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'no-undef': 'off',
            'react/jsx-curly-brace-presence': [
                'error',
                { props: 'never', children: 'never' },
            ],
            'prefer-template': 'error',
            'no-multi-spaces': 'error',
            'no-useless-escape': 'off',
        },
    },
];
