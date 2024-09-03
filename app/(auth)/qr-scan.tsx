import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, Image, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { CsText, CsButton, CsCard } from "@/components/commons";
import { QRScanner } from "@/components/QRScanner";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";
import { UserRole, Teacher, ClassSchedule } from "@/types";
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

// Helper function for handling errors (Efficiency and Resource Management)
const handleError = (setError: Function, message: string) => {
  setError(message);
};

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

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <CsCard style={styles.modalContent}>
          <CsText variant="h3" style={styles.modalTitle}>
            Welcome, {teacher.fullName}!
          </CsText>
          <CsText variant="body" style={styles.modalText}>
            Your class is scheduled from{" "}
            {extractHourAndMinute(schedule.startTime)} to{" "}
            {extractHourAndMinute(schedule.endTime)}.
          </CsText>
          <CsButton
            title="Continue"
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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const teachers = useAtomValue(teachersListAtom);
  const schedules = useAtomValue(classScheduleAtom);
  const currentClass = useAtomValue(currentClassAtom);
  const currentTeacher = useAtomValue(currentTeacherAtom);
  const currentSchedule = useAtomValue(currentScheduleAtom);

  const setCurrentTeacher = useSetAtom(currentTeacherAtom);
  const setCurrentSchedule = useSetAtom(currentScheduleAtom);

  // New animations
  const [scanAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animate scan area like a breathing effect
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

  const validateQRCodeData = (
    data: string,
  ): [string, string, string | undefined] | null => {
    const parts = data.split("|---|");
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      return null;
    }
    return parts as [string, string, string | undefined];
  };

  const fetchTeacherData = (
    userId: string,
    teachers: Teacher[],
  ): Teacher | null => {
    return teachers.find((t) => t.id === userId) || null;
  };

  const checkSchedule = (
    userId: string,
    schedules: ClassSchedule[],
  ): ClassSchedule | null => {
    return checkScheduledClass(
      userId,
      schedules,
      "No scheduled class for this teacher at the current time",
    );
  };

  const handleTeacherRole = (
    setCurrentTeacher: Function,
    setCurrentSchedule: Function,
    setShowWelcomeModal: Function,
    teacher: Teacher,
    schedule: ClassSchedule,
  ) => {
    setCurrentTeacher(teacher);
    setCurrentSchedule(schedule);
    setShowWelcomeModal(true);
  };

  const handleDirectorScan = async (schoolId: string) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.navigate({
      pathname: "/(auth)/login",
      params: { role: UserRole.DIRECTOR, schoolId },
    });
  };

  const handleTeacherScan = async (userId: string) => {
    const teacher = fetchTeacherData(userId, teachers);
    if (!teacher) {
      handleError(setError, "Teacher not found for this class");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const schedule = checkSchedule(userId, schedules);
    if (!schedule) {
      handleError(
        setError,
        "No scheduled class for this teacher at the current time",
      );

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setCurrentSchedule(schedule);

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleTeacherRole(
      setCurrentTeacher,
      setCurrentSchedule,
      setShowWelcomeModal,
      teacher,
      schedule,
    );
  };

  const handleQRScan = async (data: string) => {
    setError(null);

    const parts = validateQRCodeData(data);
    if (!parts) {
      handleError(setError, "Invalid QR code format");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const [role, schoolId, userId] = parts;

    if (role === UserRole.DIRECTOR) {
      await handleDirectorScan(schoolId);
    } else if (role === UserRole.TEACHER) {
      if (!userId) {
        handleError(setError, "Invalid teacher QR code");
        return;
      }
      await handleTeacherScan(userId);
    } else {
      setCurrentSchedule(null);
      handleError(setError, "Invalid user role");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

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

  const toggleScanner = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).then((r) => r);

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
            <CsText variant="body" color="error" style={styles.error}>
              {error}
            </CsText>
          </CsCard>
        )}
        <CsButton
          title={showScanner ? "Annuler le scan" : "Commencer le scan"}
          onPress={toggleScanner}
          style={styles.button}
        />

        {/* TODO: Remove later */}
        <CsButton
          title="Simuler le résultat du scan"
          onPress={() =>
            handleQRScan(
              "teacher|---|66c0ceef0014ccb3fcc8|---|66c2b025001639733b61",
            )
          }
          variant="text"
          style={styles.simulateButton}
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
      width: 100,
      height: 100,
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
  });
