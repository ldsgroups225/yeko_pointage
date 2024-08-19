import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
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
      <View style={themedStyles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          responsiveOrientationWhenOrientationLocked={true}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={themedStyles.overlay}>
            <CsText variant="h3" style={themedStyles.scanText}>
              Scan QR Code
            </CsText>
            <CsButton
              title="Cancel"
              onPress={onClose}
              style={themedStyles.cancelButton}
            />
          </View>
        </CameraView>
        <Modal visible={showInfoModal} transparent animationType="fade">
          <View style={themedStyles.modalOverlay}>
            <CsCard style={themedStyles.modalContent}>
              <CsText variant="h3" style={themedStyles.modalTitle}>
                QR Code Scanned
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
                />
              </View>
            </CsCard>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-end",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: spacing.lg,
      alignItems: "center",
    },
    scanText: {
      color: theme.textLight,
      marginBottom: spacing.lg,
    },
    cancelButton: {
      width: "100%",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      padding: spacing.lg,
      width: "80%",
    },
    modalTitle: {
      marginBottom: spacing.md,
    },
    modalText: {
      marginBottom: spacing.lg,
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
