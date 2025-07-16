import type { ImageSourcePropType } from 'react-native'
import type { SvgProps } from 'react-native-svg'
import React from 'react'
import { Image, Modal, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Button, Text } from '@/components/nativeui'

interface ConfirmationModalProps {
  isVisible: boolean
  onConfirm: () => void
  onCancel?: () => void
  message?: string
  title?: string
  confirmText?: string
  cancelText?: string
  image?: ImageSourcePropType
  SvgComponent?: React.FC<SvgProps>
  children?: React.ReactNode
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  message,
  title = 'Confirmation',
  confirmText = 'Oui',
  cancelText = 'Non',
  image,
  SvgComponent,
  children,
}) => {
  const styles = StyleSheet.create({
    imageResizeMode: {
      resizeMode: 'contain',
    },
  })

  if (!isVisible)
    return null

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          className="w-full max-w-sm items-center rounded-2xl bg-card p-6 shadow-lg"
        >
          {image && <Image source={image} className="h-24 w-24 mb-4" style={styles.imageResizeMode} />}
          {SvgComponent && (
            <SvgComponent width={100} height={100} className="mb-4" />
          )}
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
          {children}
          <View className="w-full flex-row items-center gap-x-3">
            {onCancel && (
              <View className="flex-1">
                <Button variant="secondary" onPress={onCancel}>
                  <Text>{cancelText}</Text>
                </Button>
              </View>
            )}
            <View className="flex-1">
              <Button variant="primary" onPress={onConfirm}>
                <Text>{confirmText}</Text>
              </Button>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

export default ConfirmationModal
