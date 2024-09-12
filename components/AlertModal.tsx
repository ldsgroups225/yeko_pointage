import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  Image,
  ImageSourcePropType,
} from "react-native";
import { CsButton, CsText } from "@/components/commons";
import { useThemedStyles } from "@/hooks";
import { borderRadius, spacing } from "@/styles";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

interface AlertModalProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  buttonText?: string;
  image?: ImageSourcePropType;
  SvgComponent?: React.FC<SvgProps>;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isVisible,
  onClose,
  message,
  title = "Alert",
  buttonText = "OK",
  image,
  SvgComponent,
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
          {image && <Image source={image} style={styles.image} />}
          {SvgComponent && (
            <SvgComponent width={100} height={100} style={styles.image} />
          )}
          <CsText variant="h3" style={styles.modalTitle}>
            {title}
          </CsText>
          <CsText variant="body" style={styles.modalMessage}>
            {message}
          </CsText>
          <View style={styles.buttonContainer}>
            <CsButton
              title={buttonText}
              onPress={onClose}
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
      alignItems: "center",
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
      alignItems: "center",
    },
    button: {
      minWidth: 100,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: spacing.md,
    },
  });
