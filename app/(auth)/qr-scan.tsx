import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, Image, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { CsText, CsButton, CsCard } from "@/components/commons";
import { QRScanner } from "@/components/QRScanner";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";
import { UserRoleText, Teacher, ClassSchedule } from "@/types";
import { useAtomValue, useSetAtom } from "jotai";
import {
  classScheduleAtom,
  currentClassAtom,
  currentTeacherAtom,
  teachersListAtom,
  currentScheduleAtom,
} from "@/store/atoms";
import { checkScheduledClass, extractHourAndMinute } from "@/utils/dateTime";
import ToastColor from "../../styles/toast";

interface WelcomeModalProps {
  isVisible: boolean;
  teacher: Teacher;
  schedule: ClassSchedule;
  onContinue: () => void;
}

// Helper function for handling errors
const handleError = (
  setError: Function,
  message: string,
  showErrorModal: Function,
) => {
  setError(message);
  showErrorModal(true); // Show the error modal in QRScanner
};

// Welcome Modal Component
const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isVisible,
  teacher,
  schedule,
  onContinue,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <CsCard style={styles.modalContent}>
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
      </View>
    </Modal>
  );
};

export default function QRScanScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false); // State for the error modal in QRScanner
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const teachers = useAtomValue(teachersListAtom);
  const schedules = useAtomValue(classScheduleAtom);
  const currentClass = useAtomValue(currentClassAtom);
  const currentTeacher = useAtomValue(currentTeacherAtom);
  const currentSchedule = useAtomValue(currentScheduleAtom);

  const setCurrentTeacher = useSetAtom(currentTeacherAtom);
  const setCurrentSchedule = useSetAtom(currentScheduleAtom);

  // Animations
  const [scanAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    // Breathing animation for the scan area
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // QR Code Validation
  const validateQRCodeData = (
    data: string,
  ): [string, string, string?] | null => {
    const parts = data.split("|---|");
    return parts.length >= 2 ? (parts as [string, string, string?]) : null;
  };

  // Teacher Data Retrieval
  const fetchTeacherData = (userId: string): Teacher | null => {
    return teachers.find((t) => t.id === userId) || null;
  };

  // Schedule Verification
  const checkSchedule = (userId: string): ClassSchedule | null => {
    return checkScheduledClass(
      userId,
      schedules,
      "Aucun cours n'est prévu pour cet enseignant à l'heure actuelle.",
    );
  };

  // Teacher Role Handling
  const handleTeacherRole = (teacher: Teacher, schedule: ClassSchedule) => {
    setCurrentTeacher(teacher);
    setCurrentSchedule(schedule);
    setShowWelcomeModal(true);
  };

  // Director Scan Handling
  const handleDirectorScan = async (schoolId: string) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.navigate({
      pathname: "/(auth)/login",
      params: { role: UserRoleText.DIRECTOR, schoolId },
    });
  };

  // Teacher Scan Handling
  const handleTeacherScan = async (userId: string) => {
    const teacher = fetchTeacherData(userId);
    if (!teacher) {
      handleError(
        setError,
        "Enseignant introuvable pour ce cours.",
        setShowErrorModal,
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const schedule = checkSchedule(userId);
    if (!schedule) {
      handleError(
        setError,
        "Aucun cours n'est prévu pour cet enseignant à l'heure actuelle.",
        setShowErrorModal,
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setCurrentSchedule(schedule);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleTeacherRole(teacher, schedule);
  };

  // QR Scan Handler
  const handleQRScan = async (data: string) => {
    setError(null);
    setShowErrorModal(false); // Reset error modal on new scan

    const parts = validateQRCodeData(data);
    if (!parts) {
      handleError(setError, "Format de code QR invalide.", setShowErrorModal);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const [role, schoolId, userId] = parts;

    if (role === UserRoleText.DIRECTOR) {
      await handleDirectorScan(schoolId);
    } else if (role === UserRoleText.TEACHER) {
      if (!userId) {
        handleError(
          setError,
          "Code QR enseignant invalide.",
          setShowErrorModal,
        );
        return;
      }
      await handleTeacherScan(userId);
    } else {
      setCurrentSchedule(null);
      handleError(setError, "Rôle utilisateur invalide.", setShowErrorModal);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Continue Button Handler
  const handleContinue = () => {
    setShowWelcomeModal(false);
    if (currentTeacher && currentSchedule && currentClass) {
      router.navigate({
        pathname: "/(teacher)/attendance",
        params: {
          teacherId: currentTeacher.id,
          classId: currentClass.id,
          scheduleId: currentSchedule.id,
        },
      });
    }
  };

  // Scanner Toggle Handler
  const toggleScanner = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.timing(fadeAnimation, {
      toValue: showScanner ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowScanner(!showScanner));
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnimation }]}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
        </View>
        <CsText variant="h2" style={styles.title}>
          Scannez votre QR Code
        </CsText>
        <CsText variant="body" style={styles.subtitle}>
          pour vous identifier
        </CsText>
        {error && (
          <CsCard style={styles.errorCard}>
            <CsText variant="body" style={styles.error}>
              {error}
            </CsText>
          </CsCard>
        )}

        {/* TODO: Remove later */}
        <CsButton
          title="Simuler le résultat du scan"
          onPress={() =>
            handleQRScan(
              "teacher|---|ed85f4e4-5133-4270-b52d-795c6e65c0f0|---|46cf18f8-1608-4fac-859b-f6ffb9e2f4ce",
            )
          }
          variant="text"
          style={styles.simulateButton}
        />

        <CsButton
          title={showScanner ? "Annuler le scan" : "Commencer le scan"}
          onPress={toggleScanner}
          style={styles.button}
        />
      </Animated.View>

      {showScanner && (
        <Animated.View
          style={[
            styles.scannerContainer,
            {
              transform: [
                {
                  scale: scanAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <QRScanner
            isVisible={showScanner}
            onScan={handleQRScan}
            onClose={toggleScanner}
            errorMessage={error}
            showErrorModal={showErrorModal}
            setShowErrorModal={setShowErrorModal}
          />
        </Animated.View>
      )}

      {currentTeacher && currentSchedule && (
        <WelcomeModal
          isVisible={showWelcomeModal}
          teacher={currentTeacher}
          schedule={currentSchedule}
          onContinue={handleContinue}
        />
      )}
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
    content: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    header: {
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    logo: {
      width: 260,
      height: 260,
      resizeMode: "contain",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: spacing.sm,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 18,
      color: theme.textLight,
      marginBottom: spacing.xl,
      textAlign: "center",
    },
    errorCard: {
      backgroundColor: ToastColor.error,
      padding: spacing.md,
      marginBottom: spacing.lg,
      borderRadius: 8,
      width: "100%",
    },
    error: {
      textAlign: "center",
      color: "white",
    },
    button: {
      minWidth: 250,
      marginBottom: spacing.md,
    },
    simulateButton: {
      marginTop: spacing.md,
    },
    scannerContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: theme.background,
      padding: spacing.lg,
      borderRadius: 8,
      alignItems: "center",
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
