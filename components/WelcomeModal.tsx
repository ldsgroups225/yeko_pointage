import React from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { CsCard, CsText, CsButton } from "@/components/commons";
import { useThemedStyles } from "@/hooks";
import { borderRadius, spacing } from "@/styles";
import { extractHourAndMinute } from "@/utils/dateTime";
import { ClassSchedule, Teacher } from "@/types";

interface WelcomeModalProps {
  isVisible: boolean;
  teacher: Teacher;
  schedule: ClassSchedule;
  onContinue: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isVisible,
  teacher,
  schedule,
  onContinue,
}) => {
  const styles = useThemedStyles(createStyles);

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      hardwareAccelerated
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onContinue} // fallback for Android back button
    >
      {/* Backdrop container without an onPress to disable dismissal on tap outside */}
      <Pressable style={styles.modalOverlay} accessible={false}>
        <TouchableWithoutFeedback>
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={styles.modalContent}
          >
            <SafeAreaView>
              <CsCard style={styles.card}>
                <CsText variant="h3" style={styles.modalTitle}>
                  Bienvenue, {teacher.fullName}!
                </CsText>
                <CsText variant="body" style={styles.modalText}>
                  Votre cours ici commence à{" "}
                  {extractHourAndMinute(schedule.startTime)} et se termine à{" "}
                  {extractHourAndMinute(schedule.endTime)}.
                </CsText>
                <CsButton
                  title="Continuer"
                  onPress={onContinue}
                  style={styles.modalButton}
                />
              </CsCard>
            </SafeAreaView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "80%",
      maxWidth: 400,
    },
    card: {
      borderRadius: borderRadius.medium,
      padding: spacing.lg,
      backgroundColor: theme.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalTitle: {
      marginBottom: spacing.md,
      textAlign: "center",
    },
    modalText: {
      marginBottom: spacing.lg,
      textAlign: "center",
    },
    modalButton: {
      marginTop: spacing.md,
    },
  });

export default WelcomeModal;
