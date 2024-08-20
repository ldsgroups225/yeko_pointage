import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { FontAwesome5 } from "@expo/vector-icons";
import { CsText, CsButton, CsCard } from "@/components/commons";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import StudentCard from "@/components/StudentCard";
import { useThemedStyles } from "@/hooks";
import { spacing, shadows } from "@/styles";
import {
  Student,
  AttendanceStatus,
  AttendanceRecord,
  AttendanceSession,
} from "@/types";
import { studentsListAtom, currentAttendanceSessionAtom } from "@/store/atoms";
import { getCurrentTimeString, formatDate } from "@/utils/dateTime";
import { SafeAreaView } from "react-native-safe-area-context";

const AttendanceScreen: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { teacherId, classId, scheduleId } = useLocalSearchParams<{
    teacherId: string;
    classId: string;
    scheduleId: string;
  }>();

  const students = useAtomValue(studentsListAtom);
  const setCurrentAttendanceSession = useSetAtom(currentAttendanceSessionAtom);

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [sessionStartTime, setSessionStartTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    StatusBar.setHidden(true);
    const startTime = getCurrentTimeString();
    setSessionStartTime(startTime);
    setCurrentTime(startTime);

    const initialRecords = students.map((student) => ({
      studentId: student.id,
      status: "present" as AttendanceStatus,
      date: startTime,
    }));
    setAttendanceRecords(initialRecords);

    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60000);

    return () => {
      clearInterval(timer);
      StatusBar.setHidden(false);
    };
  }, [students]);

  const updateAttendanceStatus = (
    studentId: string,
    status: AttendanceStatus,
  ) => {
    setAttendanceRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.studentId === studentId
          ? { ...record, status, timestamp: getCurrentTimeString() }
          : record,
      ),
    );
  };

  const renderStudentItem = ({ item: student }: { item: Student }) => {
    const record = attendanceRecords.find(
      (r) => r.studentId === student.id,
    ) || {
      studentId: student.id,
      status: "present",
      date: sessionStartTime,
    };

    return (
      <StudentCard
        student={student}
        attendanceRecord={record}
        onUpdateStatus={updateAttendanceStatus}
      />
    );
  };

  // Calculate statistics
  const totalStudents = students.length;
  const presentCount = attendanceRecords.filter(
    (r) => r.status === "present",
  ).length;
  const absentCount = attendanceRecords.filter(
    (r) => r.status === "absent",
  ).length;
  const lateCount = attendanceRecords.filter((r) => r.status === "late").length;
  const earlyDepartureCount = attendanceRecords.filter(
    (r) => r.status === "early_departure",
  ).length;

  const handleProceedToParticipation = () => {
    setShowConfirmationModal(true);
  };

  const confirmProceedToParticipation = () => {
    setShowConfirmationModal(false);
    const endTime = getCurrentTimeString();
    const now = new Date();

    const newAttendanceSession: AttendanceSession = {
      teacherId,
      classId,
      date: now.toISOString(),
      startTime: sessionStartTime,
      endTime,
      records: attendanceRecords,
    };

    setCurrentAttendanceSession(newAttendanceSession);

    // Navigate to the Participation screen
    router.push({
      pathname: "/participation",
      params: { teacherId, classId, scheduleId },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CsText variant="h2" style={styles.title}>
            Attendance
          </CsText>
          <CsText variant="body">{formatDate(new Date())}</CsText>
        </View>
        <View style={styles.headerRight}>
          <CsText variant="h3" style={styles.currentTime}>
            {currentTime}
          </CsText>
          <CsText variant="body">Started: {sessionStartTime}</CsText>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.leftColumn}>
          <CsText variant="h3" style={styles.sectionTitle}>
            Statistics
          </CsText>
          <View style={styles.statsContainer}>
            <StatCard
              icon="users"
              title="Total"
              value={totalStudents}
              color="#4A90E2"
            />
            <StatCard
              icon="user-check"
              title="Present"
              value={presentCount}
              color="#7ED321"
            />
            <StatCard
              icon="user-times"
              title="Absent"
              value={absentCount}
              color="#D0021B"
            />
            <StatCard
              icon="user-clock"
              title="Late"
              value={lateCount}
              color="#F5A623"
            />
            <StatCard
              icon="sign-out-alt"
              title="Early Departure"
              value={earlyDepartureCount}
              color="#9013FE"
            />
          </View>

          <CsButton
            title="Proceed to Participation"
            onPress={handleProceedToParticipation}
            style={styles.finalizeButton}
            icon={<FontAwesome5 name="arrow-right" size={16} color="white" />}
          />

          <ConfirmationModal
            isVisible={showConfirmationModal}
            onConfirm={confirmProceedToParticipation}
            onCancel={() => setShowConfirmationModal(false)}
            message="Are you sure you want to finalize attendance and proceed to participation tracking?"
            title="Finalize Attendance"
            confirmText="Proceed"
            cancelText="Cancel"
          />
        </View>

        <View style={styles.rightColumn}>
          <CsText variant="h3" style={styles.sectionTitle}>
            Student List
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

interface StatCardProps {
  icon: string;
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  const styles = useThemedStyles(createStyles);
  return (
    <CsCard style={styles.statCard}>
      <FontAwesome5
        name={icon}
        size={18}
        color={color}
        style={styles.statIcon}
      />
      <CsText variant="h3" style={{ ...styles.statValue, color }}>
        {value}
      </CsText>
      <CsText variant="caption" style={styles.statTitle}>
        {title}
      </CsText>
    </CsCard>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.card,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      alignItems: "flex-end",
    },
    title: {
      marginBottom: spacing.xs,
    },
    currentTime: {
      fontSize: 28,
      fontWeight: "bold",
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
    statsContainer: {
      marginBottom: spacing.md,
    },
    statCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.sm,
      marginBottom: spacing.sm,
      ...shadows.small,
    },
    statIcon: {
      marginRight: spacing.sm,
    },
    statValue: {
      fontWeight: "bold",
      marginRight: spacing.xs,
    },
    statTitle: {
      flex: 1,
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
