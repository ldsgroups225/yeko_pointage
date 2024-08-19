import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AttendanceSession, ParticipationSession } from "@/types";
import { formatDate, formatTime } from "@/utils/dateTime";

type SessionSummaryProps = {
  attendanceSession: AttendanceSession;
  participationSession: ParticipationSession;
};

export default function SessionSummary({
  attendanceSession,
  participationSession,
}: SessionSummaryProps) {
  const presentCount = attendanceSession.records.filter(
    (r) => r.status === "present",
  ).length;
  const absentCount = attendanceSession.records.filter(
    (r) => r.status === "absent",
  ).length;
  const lateCount = attendanceSession.records.filter(
    (r) => r.status === "late",
  ).length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Session Summary</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance</Text>
        <Text>Date: {formatDate(new Date(attendanceSession.date))}</Text>
        <Text>
          Time: {formatTime(new Date(attendanceSession.startTime))} -{" "}
          {formatTime(new Date(attendanceSession.endTime))}
        </Text>
        <Text>Present: {presentCount}</Text>
        <Text>Absent: {absentCount}</Text>
        <Text>Late: {lateCount}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Participation</Text>
        <Text>
          Total Participations: {participationSession.participations.length}
        </Text>
        {participationSession.participations.map((p, index) => (
          <Text key={index}>
            {p.studentId} - {formatTime(new Date(p.timestamp))}
          </Text>
        ))}
      </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
