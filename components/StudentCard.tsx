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
  isFirstAttendanceCheck: boolean;
};

const statusConfig = {
  present: { color: "#10B981", label: "Présent", icon: "user-check" },
  absent: { color: "#EF4444", label: "Absent", icon: "user-times" },
  late: { color: "#F59E0B", label: "Retard", icon: "user-clock" },
  early_departure: {
    color: "#6366F1",
    label: "Départ anticipé",
    icon: "sign-out-alt",
  },
};

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  attendanceRecord,
  onUpdateStatus,
  isFirstAttendanceCheck,
}) => {
  const styles = useThemedStyles(createStyles);

  const handleStatusChange = () => {
    let nextStatus: AttendanceStatus;

    if (isFirstAttendanceCheck) {
      // Toggle between 'present' and 'absent' for the first check
      nextStatus = attendanceRecord.status === "present" ? "absent" : "present";
    } else {
      if (attendanceRecord.status === "present") return;
      // Toggle between 'absent' and 'late' for subsequent checks
      nextStatus = attendanceRecord.status === "absent" ? "late" : "absent";
    }

    onUpdateStatus(student.id, nextStatus);
  };

  const { color, label, icon } = statusConfig[attendanceRecord.status];

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
        style={[styles.statusBadge, { backgroundColor: color }]}
        onPress={handleStatusChange}
      >
        <FontAwesome5 name={icon} size={12} color="white" />
        <CsText style={styles.badgeText}>{label}</CsText>
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
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: borderRadius.medium,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      ...shadows.small,
    },
    badgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
      marginLeft: spacing.xs,
    },
  });

export default StudentCard;
