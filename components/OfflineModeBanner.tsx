import { useAtom } from 'jotai'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { isOfflineModeAtom } from '@/store/atoms'

const $bannerColor = '#FFD60A'
const $textColor = '#000'

const styles = StyleSheet.create({
  banner: {
    backgroundColor: $bannerColor,
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: $textColor,
    fontSize: 14,
    textAlign: 'center',
  },
})

export default function OfflineModeBanner() {
  const [isOfflineMode] = useAtom(isOfflineModeAtom)

  if (!isOfflineMode) {
    return null
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        You are currently offline. Some features may be limited.
      </Text>
    </View>
  )
}
