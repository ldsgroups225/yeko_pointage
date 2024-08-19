import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAttendance } from "@/hooks/useAttendance";
import { AttendanceStatus, Student } from "@/types";
import { formatDate } from "@/utils/dateTime";

type AttendanceListProps = {
  students: Student[];
  date: Date;
};

export default function AttendanceList({
  students,
  date,
}: AttendanceListProps) {
  const { currentSession, recordAttendance } = useAttendance();

  const handleAttendanceChange = (
    studentId: string,
    status: AttendanceStatus,
  ) => {
    if (currentSession) {
      recordAttendance({
        classId: "",
        id: "",
        studentId,
        status,
        date: formatDate(date),
      }).then((r) => r);
    }
  };

  const renderItem = ({ item: student }: { item: Student }) => {
    const record = currentSession?.records.find(
      (r) => r.studentId === student.id,
    );
    return (
      <View style={styles.row}>
        <Text style={styles.name}>{student.fullName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              record?.status === "present" && styles.activeButton,
            ]}
            onPress={() => handleAttendanceChange(student.id, "present")}
          >
            <Text>Present</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              record?.status === "absent" && styles.activeButton,
            ]}
            onPress={() => handleAttendanceChange(student.id, "absent")}
          >
            <Text>Absent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              record?.status === "late" && styles.activeButton,
            ]}
            onPress={() => handleAttendanceChange(student.id, "late")}
          >
            <Text>Late</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={students}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    padding: 5,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
});
