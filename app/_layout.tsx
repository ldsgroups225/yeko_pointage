import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAtomValue } from 'jotai/index'
import React from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider } from '@/providers/AuthProvider'
import ThemeProvider from '@/providers/ThemeProvider'
import { userColorSchemeAtom } from '@/store/atoms'

import 'react-native-url-polyfill/auto'

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
})

export default function RootLayout() {
  const userColorScheme = useAtomValue(userColorSchemeAtom)

  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusBar style={userColorScheme === 'dark' ? 'light' : 'dark'} />
        <GestureHandlerRootView style={styles.flex1}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: 'Yeko Pointage',
              }}
            />
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(director)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  )
}
