import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { CsText } from "@/components/commons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Student, AttendanceStatus, AttendanceRecord } from "@/types";
import { useThemedStyles } from "@/hooks";
import { spacing, shadows, borderRadius } from "@/styles";

type StudentCardProps = {
  student: Student;
  attendanceRecord: AttendanceRecord;
  onUpdateStatus: (studentId: string, status: AttendanceStatus) => void;
};

const statusConfig = {
  present: { color: "#10B981", icon: "user-check" },
  absent: { color: "#EF4444", icon: "user-times" },
  late: { color: "#F59E0B", icon: "user-clock" },
  early_departure: { color: "#6366F1", icon: "sign-out-alt" },
};

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  attendanceRecord,
  onUpdateStatus,
}) => {
  const styles = useThemedStyles(createStyles);

  const handleStatusChange = () => {
    const statuses: AttendanceStatus[] = [
      "present",
      "absent",
      "late",
      "early_departure",
    ];
    const currentIndex = statuses.indexOf(attendanceRecord.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onUpdateStatus(student.id, nextStatus);
  };

  const { color, icon } = statusConfig[attendanceRecord.status];

  return (
    <View style={styles.card}>
      <View style={[styles.avatarContainer, { backgroundColor: color }]}>
        <CsText style={styles.avatar}>{student.fullName.charAt(0)}</CsText>
      </View>
      <View style={styles.infoContainer}>
        <CsText variant="body" style={styles.name}>
          {student.fullName}
        </CsText>
        <CsText variant="caption" style={styles.idNumber}>
          ID: {student.idNumber}
        </CsText>
      </View>
      <TouchableOpacity
        style={[styles.statusButton, { backgroundColor: color }]}
        onPress={handleStatusChange}
      >
        <FontAwesome5 name={icon} size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: borderRadius.medium,
      padding: spacing.sm,
      marginBottom: spacing.sm,
      ...shadows.small,
    },
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.sm,
    },
    avatar: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontWeight: "bold",
      marginBottom: 2,
    },
    idNumber: {
      color: theme.textLight,
      fontSize: 12,
    },
    statusButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      ...shadows.small,
    },
  });

export default StudentCard;
