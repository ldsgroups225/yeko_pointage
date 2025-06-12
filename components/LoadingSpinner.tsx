import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

interface LoadingSpinnerProps {
  size?: 'small' | 'large'
  color?: string
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default function LoadingSpinner({
  size = 'large',
  color = '#007AFF',
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}
