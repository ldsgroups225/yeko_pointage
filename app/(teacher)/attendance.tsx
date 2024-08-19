import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAttendance } from "@/hooks/useAttendance";
import AttendanceList from "@/components/AttendanceList";
import { useAtom } from "jotai";
import { currentClassAtom, studentsListAtom } from "@/store/atoms";

export default function AttendanceScreen() {
  const { currentSession, startSession, endSession } = useAttendance();
  const [currentClass] = useAtom(currentClassAtom);
  const [students] = useAtom(studentsListAtom);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      {currentSession ? (
        <>
          <Text>Current Session: {currentSession.date}</Text>
          <AttendanceList
            students={students}
            date={new Date(currentSession.date)}
          />
        </>
      ) : (
        <Text>No active session. Start a new session to take attendance.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
