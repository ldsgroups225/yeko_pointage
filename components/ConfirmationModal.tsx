import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { CsButton, CsText } from "@/components/commons";
import { useThemedStyles } from "@/hooks";
import { borderRadius, spacing } from "@/styles";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface ConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  message,
  title = "Confirmation",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const styles = useThemedStyles(createStyles);

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.modalContent}
        >
          <CsText variant="h3" style={styles.modalTitle}>
            {title}
          </CsText>
          <CsText variant="body" style={styles.modalMessage}>
            {message}
          </CsText>
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
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.medium,
      padding: spacing.lg,
      width: "80%",
      maxWidth: 400,
    },
    modalTitle: {
      marginBottom: spacing.md,
      textAlign: "center",
    },
    modalMessage: {
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
