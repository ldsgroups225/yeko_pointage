import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAttendance } from "@/hooks/useAttendance";
import { useParticipation } from "@/hooks/useParticipation";
import SessionSummary from "@/components/SessionSummary";

export default function SessionSummaryScreen() {
  const { currentSession: attendanceSession } = useAttendance();
  const { currentSession: participationSession } = useParticipation();

  if (!attendanceSession || !participationSession) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Session Summary</Text>
        <Text>No active session to summarize.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Session Summary</Text>
      <SessionSummary
        attendanceSession={attendanceSession}
        participationSession={participationSession}
      />
    </ScrollView>
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
