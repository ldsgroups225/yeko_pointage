import React, { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { useRouter } from "expo-router";
import { CsText, CsButton, CsCard } from "@/components/commons";
import { QRScanner } from "@/components/QRScanner";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";
import { UserRole, Teacher, ClassSchedule } from "@/types";
import { useAtomValue } from "jotai";
import {
  classScheduleAtom,
  currentClassAtom,
  teachersListAtom,
} from "@/store/atoms";
import { checkScheduledClass, extractHourAndMinute } from "@/utils/dateTime";

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
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [currentSchedule, setCurrentSchedule] = useState<ClassSchedule | null>(
    null,
  );

  const teachers = useAtomValue(teachersListAtom);
  const schedules = useAtomValue(classScheduleAtom);
  const currentClass = useAtomValue(currentClassAtom);

  const handleQRScan = async (data: string) => {
    setError(null);

    // QRScan look like "teacher/director|---|SCHOOL_ID|---|USER_ID" where "|---|USER_ID" is optional
    const [role, schoolId, userId] = data.split("|---|");

    if (!role || !schoolId) {
      setError("Invalid QR code format");
      return;
    }

    if (role === UserRole.DIRECTOR) {
      router.navigate({
        pathname: "/(auth)/login",
        params: { role: UserRole.DIRECTOR, schoolId },
      });
    } else if (role === UserRole.TEACHER) {
      if (!userId) {
        setError("Invalid teacher QR code");
        return;
      }

      const teacher = teachers.find((t) => t.id === userId);

      if (!teacher) {
        setError("Teacher not found for this class");
        return;
      }

      const schedule = checkScheduledClass(
        userId,
        schedules,
        "No scheduled class for this teacher at the current time",
      );

      if (!schedule) {
        setError("No scheduled class for this teacher at the current time");
        return;
      }

      setCurrentTeacher(teacher);
      setCurrentSchedule(schedule);
      setShowWelcomeModal(true);
    } else {
      setError("Invalid user role");
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

      {/* TODO: Remove later */}
      <CsButton
        title="Simulate Scan result"
        onPress={() =>
          handleQRScan(
            "teacher|---|66c0ceef0014ccb3fcc8|---|66c2b025001639733b61",
          )
        }
        variant="text"
        style={styles.button}
      />
      <QRScanner
        isVisible={showScanner}
        onScan={handleQRScan}
        onClose={() => setShowScanner(false)}
      />
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
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      padding: spacing.lg,
      width: "80%",
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
    modalButton: {
      alignSelf: "center",
    },
  });
