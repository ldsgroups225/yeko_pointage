import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useParticipation } from "@/hooks/useParticipation";
import ParticipationTracker from "@/components/ParticipationTracker";
import { useAtom } from "jotai";
import { currentClassAtom, studentsListAtom } from "@/store/atoms";

export default function ParticipationScreen() {
  const { currentSession, startSession, endSession } = useParticipation();
  const [currentClass] = useAtom(currentClassAtom);
  const [students] = useAtom(studentsListAtom);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participation</Text>
      {currentSession ? (
        <>
          <Text>Current Session: {currentSession.date}</Text>
          <ParticipationTracker
            students={students}
            classId={currentClass!.id}
          />
        </>
      ) : (
        <Text>
          No active session. Start a new session to track participation.
        </Text>
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
