import antfu from '@antfu/eslint-config'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactNativePlugin from 'eslint-plugin-react-native'

export default antfu(
  {
    // Core Antfu configuration
    react: false, // Disable antfu's automatic react handling
    typescript: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
    },

    // Expo-specific ignores
    ignores: [
      '**/expo-env.d.ts',
      '.expo/',
      'node_modules/',
      'dist/',
      'build/',
      '*.config.js',
      '.eas/',
    ],
  },

  // React Native specific rules
  {
    files: ['**/*.{tsx,jsx,ts,js}'],
    plugins: {
      'react-native': reactNativePlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      globals: {
        __DEV__: 'readonly',
        React: true,
        JSX: true,
      },
    },
    rules: {
      'react-native/no-unused-styles': 'off',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'off', // Temporarily disable due to ESLint v9 incompatibility
    },
  },

  // Modified Expo config files section
  {
    files: [
      '*.config.ts', // Added TypeScript config files
      '*.config.js',
      '**/config/**/*.ts', // Added TypeScript config files in config directories
      '**/config/**/*.js',
    ],
    languageOptions: {
      sourceType: 'script',
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly', // Already present but kept for clarity
      },
    },
    rules: {
      'node/prefer-global/process': 'off', // Disable the problematic rule
      'style/no-tabs': 'off',
      'antfu/consistent-list-newline': 'off',
    },
  },

  // TypeScript overrides
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'ts/no-require-imports': 'off',
      'ts/consistent-type-imports': 'error',
    },

    ignores: [
      '.expo',
      'cline_mcp_settings.json',
      'ARCHITECTURE.md',
      'android',
      'ios',
      'scripts/reset-project.js',
    ],
  },
)
