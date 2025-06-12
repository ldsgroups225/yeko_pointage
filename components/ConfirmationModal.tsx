import type {
  ImageSourcePropType,
} from 'react-native'
import type { SvgProps } from 'react-native-svg'
import React from 'react'
import {
  Image,
  Modal,
  StyleSheet,
  View,
} from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { CsButton, CsText } from '@/components/commons'
import { useThemedStyles } from '@/hooks'
import { borderRadius, spacing } from '@/styles'

interface ConfirmationModalProps {
  isVisible: boolean
  onConfirm: () => void
  onCancel: () => void
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
  const styles = useThemedStyles(createStyles)

  if (!isVisible)
    return null

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.modalContent}
        >
          {image && <Image source={image} style={styles.image} />}
          {SvgComponent && (
            <SvgComponent width={100} height={100} style={styles.image} />
          )}
          {title && (
            <CsText variant="h3" style={styles.modalTitle}>
              {title}
            </CsText>
          )}
          {message && (
            <CsText variant="body" style={styles.modalMessage}>
              {message}
            </CsText>
          )}
          {children}
          <View style={styles.buttonContainer}>
            <CsButton
              title={cancelText}
              onPress={onCancel}
              style={styles.button}
              variant="outline"
            />
            <CsButton
              title={confirmText}
              onPress={onConfirm}
              style={styles.button}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const $modalOverlayColor = 'rgba(0, 0, 0, 0.5)'
const $shadowColor = '#000'

function createStyles(theme: Theme) {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: $modalOverlayColor,
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.medium,
      padding: spacing.lg,
      width: '80%',
      maxWidth: 400,
      alignItems: 'center',
      shadowColor: $shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalTitle: {
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    modalMessage: {
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: spacing.md,
      resizeMode: 'contain',
    },
  })
}

export default ConfirmationModal
