import * as NavigationBar from 'expo-navigation-bar'
import { useColorScheme as useNativewindColorScheme } from 'nativewind'
import * as React from 'react'
import { Platform } from 'react-native'
import { COLORS } from '@/theme/colors'

function useColorScheme() {
  const { colorScheme, setColorScheme: setNativewindColorScheme } = useNativewindColorScheme()

  async function setColorScheme(colorScheme: 'light' | 'dark') {
    setNativewindColorScheme(colorScheme)
    if (Platform.OS !== 'android')
      return
    try {
      await setNavigationBar(colorScheme)
    }
    catch (error) {
      console.error('useColorScheme.tsx", "setColorScheme', error)
    }
  }

  function toggleColorScheme() {
    return setColorScheme(colorScheme === 'light' ? 'dark' : 'light')
  }

  return {
    colorScheme: colorScheme ?? 'light',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
    colors: COLORS[colorScheme ?? 'light'],
  }
}

/**
 * Set the Android navigation bar color based on the color scheme.
 */
function useInitialAndroidBarSync() {
  const { colorScheme } = useColorScheme()
  React.useEffect(() => {
    if (Platform.OS !== 'android')
      return
    setNavigationBar(colorScheme).catch((error) => {
      console.error('useColorScheme.tsx", "useInitialColorScheme', error)
    })
  }, [colorScheme])
}

export { useColorScheme, useInitialAndroidBarSync }

function setNavigationBar(colorScheme: 'light' | 'dark') {
  // With edge-to-edge enabled, setPositionAsync and setBackgroundColorAsync are not supported on Android.
  // The navigation bar is transparent by default and the content is drawn behind it.
  // We only need to set the button style for contrast.
  return NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark')
}
