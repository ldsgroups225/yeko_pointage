import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, Modal } from "react-native";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { QR_CODE_PREFIX } from "@/config/constants";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";
import { CsButton, CsText } from "@/components/commons";
import type { ITheme } from "@/styles/theme";
import ConfirmationModal from "./ConfirmationModal";

interface QRScannerProps {
  isVisible: boolean;
  onScan: (data: string) => void;
  onClose: () => void;
  showErrorModal: boolean;
  errorMessage: string | null;
  setShowErrorModal: (value: boolean) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  isVisible,
  onScan,
  onClose,
  showErrorModal,
  setShowErrorModal,
  errorMessage,
}) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const [scanned, setScanned] = useState(false);
  const facing: CameraType = "back";
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission().then((r) => r);
  }, []);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    setScanned(true);
    if (data.startsWith(QR_CODE_PREFIX)) {
      const scanResult = data.slice(QR_CODE_PREFIX.length);
      onScan(scanResult);
    } else {
      setShowErrorModal(true);
    }
  };

  const handleRescan = () => {
    setScanned(false);
    setShowErrorModal(false);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={themedStyles.container}>
        <CsText variant="h3">
          Nous avons besoin de votre autorisation pour accéder à la caméra.
        </CsText>
        <CsButton onPress={requestPermission} title="Accorder l'autorisation" />
      </View>
    );
  }

  return (
    <Modal visible={isVisible} animationType="slide">
      <SafeAreaView style={themedStyles.container}>
        <View style={themedStyles.header}>
          <CsText variant="h2" style={themedStyles.title}>
            Scanner le code QR
          </CsText>
          <CsButton
            onPress={onClose}
            title=""
            style={themedStyles.closeButton}
            icon={
              <Ionicons
                name="close"
                size={24}
                color={themedStyles.closeButton.color}
              />
            }
          />
        </View>
        <View style={themedStyles.cameraContainer}>
          <CameraView
            style={themedStyles.camera}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={themedStyles.scanOverlay}>
              <View style={themedStyles.scanFrame} />
            </View>
          </CameraView>
        </View>
        <View style={themedStyles.footer}>
          <CsText variant="body" style={themedStyles.footerText}>
            Positionnez le code QR dans le cadre pour le scanner
          </CsText>
        </View>

        <ConfirmationModal
          isVisible={showErrorModal}
          onConfirm={handleRescan}
          onCancel={handleRescan}
          message={errorMessage || "Code QR invalide"}
          title="Erreur"
          confirmText="Scanner à nouveau"
          cancelText="Fermer"
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.md,
    },
    title: {
      color: theme.text,
    },
    closeButton: {
      backgroundColor: "transparent",
      color: theme.text,
    },
    cameraContainer: {
      flex: 1,
      overflow: "hidden",
      borderRadius: 16,
      margin: spacing.md,
    },
    camera: {
      flex: 1,
    },
    scanOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    scanFrame: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: theme.primary,
      backgroundColor: "transparent",
    },
    footer: {
      padding: spacing.md,
      alignItems: "center",
    },
    footerText: {
      color: theme.text,
      textAlign: "center",
    },
  });
