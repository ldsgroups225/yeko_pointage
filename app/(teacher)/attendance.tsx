import React, { useMemo, useCallback, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { FontAwesome5 } from "@expo/vector-icons";
import { CsText, CsButton } from "@/components/commons";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import StudentCard from "@/components/StudentCard";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";
import { Student } from "@/types";
import { studentsListAtom, currentScheduleAtom } from "@/store/atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatCard } from "@/components/StatCard";
import { useAttendanceRecords } from "@/hooks/useAttendanceRecords";

const AttendanceScreen: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { teacherId, classId, scheduleId } = useLocalSearchParams<{
    teacherId: string;
    classId: string;
    scheduleId: string;
  }>();

  const students = useAtomValue(studentsListAtom);
  const currentSchedule = useAtomValue(currentScheduleAtom);

  const {
    attendanceRecords,
    updateAttendanceStatus,
    isFirstAttendanceFinished,
    setIsFirstAttendanceFinished,
    finalizeAttendance,
  } = useAttendanceRecords(students, teacherId, classId, currentSchedule);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleProceedToParticipation = useCallback(() => {
    setShowConfirmationModal(true);
  }, []);

  const handleFinalizeAttendance = useCallback(() => {
    if (isFirstAttendanceFinished) {
      handleProceedToParticipation();
    } else {
      setIsFirstAttendanceFinished(true);
      finalizeAttendance();
    }
  }, [
    isFirstAttendanceFinished,
    handleProceedToParticipation,
    setIsFirstAttendanceFinished,
    finalizeAttendance,
  ]);

  const confirmProceedToParticipation = useCallback(() => {
    setShowConfirmationModal(false);
    router.push({
      pathname: "/participation",
      params: { teacherId, classId, scheduleId },
    });
  }, [router, teacherId, classId, scheduleId]);

  const renderStudentItem = useCallback(
    ({ item: student }: { item: Student }) => {
      const record = attendanceRecords.find((r) => r.studentId === student.id);
      if (!record) {
        // console.error(`No attendance record found for student ${student.id}`);
        return null;
      }
      return (
        <StudentCard
          student={student}
          attendanceRecord={record}
          onUpdateStatus={updateAttendanceStatus}
          isFirstAttendanceCheck={!isFirstAttendanceFinished}
        />
      );
    },
    [attendanceRecords, updateAttendanceStatus, isFirstAttendanceFinished],
  );

  const attendanceStats = useMemo(() => {
    const totalStudents = students.length;
    const presentCount = attendanceRecords.filter(
      (r) => r.status === "present",
    ).length;
    const absentCount = attendanceRecords.filter(
      (r) => r.status === "absent",
    ).length;
    const lateCount = attendanceRecords.filter(
      (r) => r.status === "late",
    ).length;
    const earlyDepartureCount = attendanceRecords.filter(
      (r) => r.status === "early_departure",
    ).length;

    return {
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      earlyDepartureCount,
    };
  }, [students, attendanceRecords]);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View style={styles.body}>
        <View style={styles.leftColumn}>
          <CsText variant="h3" style={styles.sectionTitle}>
            Statistiques
          </CsText>
          <View style={styles.statsContainer}>
            <StatCard
              icon="users"
              title="Total"
              value={attendanceStats.totalStudents}
              color="#4A90E2"
            />
            <StatCard
              icon="user-check"
              title="Présents"
              value={attendanceStats.presentCount}
              color="#7ED321"
            />
            <StatCard
              icon="user-times"
              title="Absents"
              value={attendanceStats.absentCount}
              color="#D0021B"
            />
            <StatCard
              icon="user-clock"
              title="En retard"
              value={attendanceStats.lateCount}
              color="#F5A623"
            />
            <StatCard
              icon="sign-out-alt"
              title="Départ anticipé"
              value={attendanceStats.earlyDepartureCount}
              color="#9013FE"
            />
          </View>

          <CsButton
            title={
              isFirstAttendanceFinished
                ? "Attribuer participations"
                : "Terminer l'appel"
            }
            onPress={handleFinalizeAttendance}
            style={styles.finalizeButton}
            icon={
              isFirstAttendanceFinished ? (
                <FontAwesome5 name="arrow-right" size={16} color="white" />
              ) : (
                <FontAwesome5 name="check" size={16} color="white" />
              )
            }
          />

          <ConfirmationModal
            isVisible={showConfirmationModal}
            onConfirm={confirmProceedToParticipation}
            onCancel={() => setShowConfirmationModal(false)}
            message="Êtes-vous sûr de vouloir finaliser l'appel et passer à l'attribution des participations ?"
            title="Finaliser l'appel"
            confirmText="Continuer"
            cancelText="Annuler"
          />
        </View>

        <View style={styles.rightColumn}>
          <CsText variant="h3" style={styles.sectionTitle}>
            Liste des élèves
          </CsText>
          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    body: {
      flex: 1,
      flexDirection: "row",
    },
    leftColumn: {
      flex: 1,
      padding: spacing.md,
      borderRightWidth: 1,
      borderRightColor: theme.border,
    },
    rightColumn: {
      flex: 2,
      padding: spacing.md,
    },
    sectionTitle: {
      marginBottom: spacing.md,
      fontWeight: "bold",
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: spacing.md,
    },
    finalizeButton: {
      marginTop: spacing.md,
    },
  });

export default AttendanceScreen;
