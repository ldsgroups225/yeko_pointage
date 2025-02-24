import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { CsText, CsButton, CsCard } from "@/components/commons";
import { QRScanner } from "@/components/QRScanner";
import { useClass, useThemedStyles, useSchool } from "@/hooks";
import { spacing } from "@/styles";
import { UserRoleText, Teacher, ClassSchedule } from "@/types";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  classScheduleAtom,
  currentClassAtom,
  currentTeacherAtom,
  teachersListAtom,
  currentScheduleAtom,
  currentSchoolAtom,
  studentsListAtom,
  updateMetaDataAtom,
} from "@/store/atoms";
import { checkScheduledClass } from "@/utils/dateTime";
import ToastColor from "../../styles/toast";
import { useSchoolYear } from "@/hooks/useSchoolYear";
import WelcomeModal from "@/components/WelcomeModal";

const handleError = (
  setError: Function,
  message: string,
  showErrorModal: Function,
) => {
  setError(message);
  showErrorModal(true);
};

export default function QRScanScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const teachers = useAtomValue(teachersListAtom);
  const schedules = useAtomValue(classScheduleAtom);
  const currentClass = useAtomValue(currentClassAtom);
  const currentTeacher = useAtomValue(currentTeacherAtom);
  const currentSchedule = useAtomValue(currentScheduleAtom);

  const [, updateMetaData] = useAtom(updateMetaDataAtom);
  const setCurrentTeacher = useSetAtom(currentTeacherAtom);
  const setCurrentSchedule = useSetAtom(currentScheduleAtom);

  const { fetchSchoolYearAndSemester } = useSchoolYear();

  // Animations
  const [scanAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(1));

  //! TODO: Remove
  const [isSimulateClassAttribution, setIsSimulateClassAttribution] =
    useState(false);
  const setCurrentClass = useSetAtom(currentClassAtom);
  const setCurrentSchool = useSetAtom(currentSchoolAtom);
  const setStudentsList = useSetAtom(studentsListAtom);
  const setTeachersList = useSetAtom(teachersListAtom);
  const setClassScheduleList = useSetAtom(classScheduleAtom);
  const { getSchoolById } = useSchool();
  const { fetchClassDetails } = useClass();

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

  //! TODO: Remove
  const handleSaveConfig = async () => {
    try {
      setIsSimulateClassAttribution(true);
      const promiseSchool = getSchoolById(
        "ed85f4e4-5133-4270-b52d-795c6e65c0f0",
      );
      const promiseClassDetails = fetchClassDetails(
        "c1d2e3f4-a5b6-4f7c-8d9e-0f1a2b3c4d5e",
      );
      const [school, classDetails] = await Promise.all([
        promiseSchool,
        promiseClassDetails,
      ]);

      if (school && classDetails) {
        setCurrentClass(classDetails.class);
        setCurrentSchool(school);
        setStudentsList(classDetails.students);
        setTeachersList(classDetails.teachers);
        setClassScheduleList(classDetails.schedules);

        updateMetaData({
          schoolId: school.id,
          classId: classDetails.class.id,
        });

        await fetchSchoolYearAndSemester();
      }
    } catch (err) {
      setError("Failed to save configuration. Please try again later.");
      console.error("[E_CONFIG_SAVE_CONF]:", err);
    } finally {
      setIsSimulateClassAttribution(false);
    }
  };

  // QR Code Validation
  const validateQRCodeData = (
    data: string,
  ): [string, string, string?] | null => {
    const parts = data.split("|---|");
    return parts.length >= 2 ? (parts as [string, string, string?]) : null;
  };

  // Teacher Data Retrieval
  const findTeacherData = (userId: string): Teacher | null => {
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
  const handleTeacherRole = async (
    teacher: Teacher,
    schedule: ClassSchedule,
  ) => {
    try {
      setCurrentTeacher(teacher);
      setCurrentSchedule(schedule);

      await fetchSchoolYearAndSemester();

      updateMetaData({
        teacherId: teacher.id,
        subjectId: currentSchedule!.subjectId,
      });
      setShowWelcomeModal(true);
    } catch (error) {
      handleError(
        setError,
        "Veuillez scanner à  nouveau le code QR.",
        setShowErrorModal,
      );
    }
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
    try {
      const teacher = findTeacherData(userId);
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
      await handleTeacherRole(teacher, schedule);

      // TODO: Remove
      updateMetaData({
        teacherId: "46cf18f8-1608-4fac-859b-f6ffb9e2f4ce",
        subjectId: currentSchedule!.subjectId,
      });
    } catch (error) {
      handleError(
        setError,
        "Veuillez scanner à  nouveau le code QR.",
        setShowErrorModal,
      );
    }
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
          onPress={async () =>
            await handleQRScan(
              "teacher|---|ed85f4e4-5133-4270-b52d-795c6e65c0f0|---|46cf18f8-1608-4fac-859b-f6ffb9e2f4ce",
            )
          }
          variant="text"
          style={styles.simulateButton}
        />

        <CsButton
          title="Simuler l'attribution de classe"
          onPress={handleSaveConfig}
          variant="text"
          loading={isSimulateClassAttribution}
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
  });
