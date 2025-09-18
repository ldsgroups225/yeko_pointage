import type { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Yeko Pointage',
  slug: 'yeko-pointage',
  version: '1.0.0',
  scheme: 'yeko-pointage',
  orientation: 'default',
  icon: './assets/images/icon.png', // recommended 1024x1024 png
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'io.ldsgroups.yekoPointage',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'io.ldsgroup.yeko_pointage',
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
    ],
  },
  web: {
    favicon: './assets/images/favicon.png',
    output: 'static',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    [
      '@react-native-google-signin/google-signin',
      {
        iosUrlScheme: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
  ],
  extra: {
    router: {},
    eas: {
      projectId: 'ab681a19-85d8-4808-905a-849369ea71ef',
    },
  },
  owner: 'ldsgroups225',
})
