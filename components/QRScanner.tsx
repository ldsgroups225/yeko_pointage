import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View, SafeAreaView } from "react-native";
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
import { CsButton, CsCard, CsText } from "@/components/commons";
import type { ITheme } from "@/styles/theme";
import { UserRole } from "@/types";

interface QRScannerProps {
  isVisible: boolean;
  onScan: (data: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  isVisible,
  onScan,
  onClose,
}) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const [scanned, setScanned] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const facing: CameraType = "back";
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission().then((r) => r);
  }, []);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    setScanned(true);
    if (data.startsWith(QR_CODE_PREFIX)) {
      setScanResult(data.slice(QR_CODE_PREFIX.length));
      setShowInfoModal(true);
    } else {
      alert("Invalid QR Code");
      setScanned(false);
    }
  };

  const handleConfirm = () => {
    setShowInfoModal(false);
    if (scanResult) {
      onScan(scanResult);
    }
  };

  const handleRescan = () => {
    setScanned(false);
    setShowInfoModal(false);
    setScanResult(null);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={themedStyles.container}>
        <CsText variant="h3">We need your permission to show the camera</CsText>
        <CsButton onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <Modal visible={isVisible} animationType="slide">
      <SafeAreaView style={themedStyles.container}>
        <View style={themedStyles.header}>
          <CsText variant="h2" style={themedStyles.title}>
            Scan QR Code
          </CsText>
          <CsButton
            onPress={onClose}
            title="TODO"
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
            Position the QR code within the frame to scan
          </CsText>
        </View>
        <Modal visible={showInfoModal} transparent animationType="fade">
          <View style={themedStyles.modalOverlay}>
            <CsCard style={themedStyles.modalContent}>
              <CsText variant="h3" style={themedStyles.modalTitle}>
                QR Code Scanned Successfully
              </CsText>
              <CsText variant="body" style={themedStyles.modalText}>
                {(scanResult ?? "").startsWith(UserRole.DIRECTOR)
                  ? "You will be redirected to the login screen."
                  : "You will be redirected to the home screen."}
              </CsText>
              <View style={themedStyles.buttonContainer}>
                <CsButton
                  title="Confirm"
                  onPress={handleConfirm}
                  style={themedStyles.button}
                />
                <CsButton
                  title="Rescan"
                  onPress={handleRescan}
                  style={themedStyles.button}
                  variant="outline"
                />
              </View>
            </CsCard>
          </View>
        </Modal>
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
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.7)",
    },
    modalContent: {
      padding: spacing.lg,
      width: "90%",
      maxWidth: 400,
    },
    modalTitle: {
      marginBottom: spacing.md,
      textAlign: "center",
    },
    modalText: {
      marginBottom: spacing.lg,
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
  });
