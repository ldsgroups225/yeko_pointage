import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Button, Text } from '@/components/nativeui'

interface ConfirmationModalParams {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirmPath?: string
  onConfirmParams?: string
  onCancelPath?: string
  onCancelParams?: string
}

export default function ConfirmationModalScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()

  const {
    title = 'Confirmation',
    message,
    confirmText = 'Oui',
    cancelText = 'Non',
    onConfirmPath,
    onConfirmParams,
    onCancelPath,
    onCancelParams,
  } = params as ConfirmationModalParams

  const handleConfirm = () => {
    if (onConfirmPath) {
      const confirmParams = onConfirmParams ? JSON.parse(onConfirmParams) : {}
      router.push({
        pathname: onConfirmPath as any,
        params: confirmParams,
      })
    }
    else {
      router.back()
    }
  }

  const handleCancel = () => {
    if (onCancelPath) {
      const cancelParams = onCancelParams ? JSON.parse(onCancelParams) : {}
      router.push({
        pathname: onCancelPath as any,
        params: cancelParams,
      })
    }
    else {
      router.back()
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-black/50 p-4">
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        className="w-full max-w-sm items-center rounded-2xl bg-card p-6 shadow-lg"
      >
        {title && (
          <Text variant="title3" className="mb-2 text-center">
            {title}
          </Text>
        )}
        {message && (
          <Text color="muted" className="mb-6 text-center">
            {message}
          </Text>
        )}
        <View className="w-full flex-row items-center gap-x-3">
          <View className="flex-1">
            <Button variant="secondary" onPress={handleCancel}>
              <Text>{cancelText}</Text>
            </Button>
          </View>
          <View className="flex-1">
            <Button variant="primary" onPress={handleConfirm}>
              <Text>{confirmText}</Text>
            </Button>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}
