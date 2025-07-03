module.exports = {
    globals: { __PATH_PREFIX__: true },
    env: {
        es6: true,
        browser: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: ['./tsconfig.json', './example/tsconfig.json'],
        tsconfigRootDir: __dirname
    },
    extends: [
        'plugin:@aerisweather/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript'
    ],
    plugins: [
        '@typescript-eslint',
        '@aerisweather',
        'import'
    ],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx']
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: ['./tsconfig.json', './example/tsconfig.json']
            }
        }
    },
    rules: {
        'no-console': ['warn'],
        'no-shadow': 'off',
        'object-curly-newline': ['error', { consistent: true }],
        'import/no-extraneous-dependencies': 'off',
        'padding-line-between-statements': 'off',
        'unicorn/prefer-switch': 'off',
        'unicorn/no-for-loop': 'off',
        'unicorn/no-null': 'off',
        'unicorn/prefer-node-protocol': 'off',
        'unicorn/prefer-module': 'off',

        // TypeScript
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/semi': ['error', 'always'],

        // JSX
        'jsx-quotes': ['error', 'prefer-double'],

        // Import
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
                json: 'never',
                css: 'always'
            }
        ],
        'import/no-unresolved': 'off', // change this back to error!!
        'import/no-cycle': 'off'
    },
    overrides: [{
        files: ['packages/**/tests/**/*.ts'],
        rules: {
            'max-len': 'off',
            'no-async-promise-executor': 'off',
            'unicorn/prefer-add-event-listener': 'off',
            '@typescript-eslint/no-shadow': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@aerisweather/object-braces-inside-array': 'off'
        }
    }, {
        files: ['example/**/*'],
        parserOptions: {
            project: ['./example/tsconfig.json'],
            tsconfigRootDir: __dirname
        }
    }, {
        files: ['vite.config.ts'],
        parserOptions: {
            project: ['./tsconfig.json']
        }
    }, {
        files: ['.eslintrc.cjs'],
        parserOptions: {
            project: null
        }
    }, {
        files: ['commitlint.config.js'],
        parserOptions: {
            project: null
        }
    }],
    ignorePatterns: [
        'packages/**/build',
        'dist',
        'vite.config.ts',
        'vite.analyze.ts',
        'example/tailwind.config.ts',
        'tailwind.config.ts',
        'example/postcss.config.cjs',
        'postcss.config.cjs',
        'example/vite.config.ts'
    ]
};
