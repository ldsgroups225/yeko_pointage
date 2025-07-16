import type {
  BarcodeScanningResult,
  CameraType,
} from 'expo-camera'
import { Icon } from '@roninoss/icons'
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera'
import React, { useEffect, useState } from 'react'
import { Modal, Pressable, SafeAreaView, StyleSheet, View } from 'react-native'
import { Button, Text } from '@/components/nativeui'
import { QR_CODE_PREFIX } from '@/config/constants'
import { useColorScheme } from '@/lib/useColorScheme'
import ConfirmationModal from './ConfirmationModal'

interface QRScannerProps {
  isVisible: boolean
  onScan: (data: string) => void
  onClose: () => void
  errorMessage: string | null
}

const $black05 = 'rgba(0, 0, 0, 0.5)'
const $white = 'white'
const $transparent = 'transparent'

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $black05,
  },
  overlayScanRect: {
    width: 256,
    height: 256,
    borderWidth: 2,
    borderColor: $white,
    borderRadius: 16,
    backgroundColor: $transparent,
  },
})

export const QRScanner: React.FC<QRScannerProps> = ({
  isVisible,
  onScan,
  onClose,
  errorMessage,
}) => {
  const CAMERA_FACING: CameraType = 'back'

  const { colors } = useColorScheme()
  const [scanned, setScanned] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()

  useEffect(() => {
    if (isVisible) {
      requestPermission()
    }
  }, [isVisible, requestPermission])

  useEffect(() => {
    if (errorMessage) {
      setShowErrorModal(true)
    }
  }, [errorMessage])

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    setScanned(true)
    if (data.startsWith(QR_CODE_PREFIX)) {
      const scanResult = data.slice(QR_CODE_PREFIX.length)
      onScan(scanResult)
    }
    else {
      setShowErrorModal(true)
    }
  }

  const handleRescan = () => {
    setScanned(false)
    setShowErrorModal(false)
  }

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <Modal visible={isVisible} animationType="slide">
        <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
          <Text variant="title3" className="text-center">
            Nous avons besoin de votre autorisation pour accéder à la caméra.
          </Text>
          <Button onPress={requestPermission} className="mt-4">
            <Text>Accorder l'autorisation</Text>
          </Button>
        </SafeAreaView>
      </Modal>
    )
  }

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between p-4">
          <Text variant="title2">Scanner le code QR</Text>
          <Pressable
            onPress={onClose}
            className="rounded-full p-2 active:bg-zinc-200 dark:active:bg-zinc-800"
          >
            <Icon name="close" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        <View className="flex-1 m-4 overflow-hidden rounded-2xl relative">
          <CameraView
            style={styles.flex1}
            facing={CAMERA_FACING}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View
            style={styles.overlay}
          >
            <View
              style={styles.overlayScanRect}
            />
          </View>
        </View>

        <View className="items-center p-4">
          <Text color="muted" className="text-center">
            Positionnez le code QR dans le cadre pour le scanner
          </Text>
        </View>

        <ConfirmationModal
          isVisible={showErrorModal}
          onConfirm={handleRescan}
          onCancel={onClose}
          message={errorMessage || 'Code QR invalide ou non supporté.'}
          title="Erreur de scan"
          confirmText="Réessayer"
          cancelText="Fermer"
        />
      </SafeAreaView>
    </Modal>
  )
}
