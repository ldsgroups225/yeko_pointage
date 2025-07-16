import { ThemeProvider as NavThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme, useInitialAndroidBarSync } from '@/lib/useColorScheme'

import { NAV_THEME } from '@/theme'
import 'expo-dev-client'

import '../../global.css'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export default function RootLayout() {
  useInitialAndroidBarSync()
  const { colorScheme, isDarkColorScheme } = useColorScheme()

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />

      <NavThemeProvider value={NAV_THEME[colorScheme]}>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(director)" options={{ headerShown: false }} />
          <Stack.Screen name="(teacher)" options={{ headerShown: false }} />
        </Stack>
      </NavThemeProvider>
    </>
  )
}
