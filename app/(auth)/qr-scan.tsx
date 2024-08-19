import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { CsText, CsButton } from "@/components/commons";
import { QRScanner } from "@/components/QRScanner";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";
import { UserRole } from "@/types";

export default function QRScanScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQRScan = async (data: string) => {
    setError(null);

    // QRScan look like "teacher/director|---|SCHOOL_ID|---|USER_ID" where "|---|USER_ID" is optional
    const [role, schoolId, userId] = data.split("|---|");

    if (!role || !schoolId || !userId) {
      setError("Invalid QR code format");
      return;
    }

    if (role === UserRole.DIRECTOR) {
      router.navigate({
        pathname: "/(auth)/login",
        params: { role: UserRole.DIRECTOR, schoolId },
      });
    } else if (role === UserRole.TEACHER) {
      // Handle teacher login or redirection. Here, "|---|USER_ID" is required
    } else {
      setError("Invalid user role");
    }
  };

  return (
    <View style={styles.container}>
      <CsText variant="h2" style={styles.title}>
        Identify you by QR Code
      </CsText>
      {error && (
        <CsText variant="body" color="error" style={styles.error}>
          {error}
        </CsText>
      )}
      <CsButton
        title={showScanner ? "Cancel Scan" : "Start Scan"}
        onPress={() => setShowScanner(!showScanner)}
        style={styles.button}
      />
      <QRScanner
        isVisible={showScanner}
        onScan={handleQRScan}
        onClose={() => setShowScanner(false)}
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
      backgroundColor: theme.background,
    },
    title: {
      marginBottom: spacing.md,
    },
    error: {
      marginBottom: spacing.md,
      textAlign: "center",
    },
    button: {
      minWidth: 200,
    },
  });
