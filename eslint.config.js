import js from '@eslint/js';
import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import {
  configs as airbnbConfigs,
  plugins as airbnbPlugins,
} from 'eslint-config-airbnb-extended';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

const jsConfig = [
  // ESLint Recommended Rules
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  // Stylistic Plugin
  airbnbPlugins.stylistic,
  // Import X Plugin
  airbnbPlugins.importX,
  // Airbnb Base Recommended Config
  ...airbnbConfigs.base.recommended,
];

const reactConfig = [
  // React Plugin
  airbnbPlugins.react,
  // React Hooks Plugin
  airbnbPlugins.reactHooks,
  // React JSX A11y Plugin
  airbnbPlugins.reactA11y,
  // Airbnb React Recommended Config
  ...airbnbConfigs.react.recommended,
];

const typescriptConfig = [
  // TypeScript ESLint Plugin
  airbnbPlugins.typescriptEslint,
  // Airbnb Base TypeScript Config
  ...airbnbConfigs.base.typescript,
  // Airbnb React TypeScript Config
  ...airbnbConfigs.react.typescript,
];

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      jsConfig,
      js.configs.recommended,
      tseslint.configs.recommended,
      reactConfig,
      typescriptConfig,
      reactRefresh.configs.vite,
      eslintPluginUnicorn.configs.recommended,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
        },
      ],
      curly: 'error',
      'import-x/prefer-default-export': 'off',
      'no-restricted-syntax': 'off',
      'no-restricted-exports': 'off',
      'react-refresh/only-export-components': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      // These should be enabled
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      // Turn off Unicorn rules
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-object-from-entries': 'off',
      'unicorn/prefer-string-replace-all': 'off',
    },
  },
]);
