import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useParticipation } from "@/hooks/useParticipation";
import { Participation, Student } from "@/types";
import { formatDate } from "@/utils/dateTime";

type ParticipationTrackerProps = {
  students: Student[];
  classId: string;
};

export default function ParticipationTracker({
  students,
  classId,
}: ParticipationTrackerProps) {
  const { currentSession, recordParticipation } = useParticipation();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleParticipation = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else if (selectedStudents.length < 5) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      alert("Maximum 5 students can be selected for participation.");
    }
  };

  const submitParticipation = () => {
    if (!currentSession) {
      alert("No active session. Please start a session first.");
      return;
    }

    selectedStudents.forEach((studentId) => {
      const participation: Omit<Participation, "id"> = {
        studentId,
        sessionId: currentSession.id,
        timestamp: new Date().toISOString(),
      };
      recordParticipation(participation).then((r) => r);
    });

    setSelectedStudents([]);
  };

  const renderItem = ({ item: student }: { item: Student }) => (
    <TouchableOpacity
      style={[
        styles.studentItem,
        selectedStudents.includes(student.id) && styles.selectedStudent,
      ]}
      onPress={() => handleParticipation(student.id)}
    >
      <Text style={styles.studentName}>{student.fullName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participation Tracker</Text>
      <Text style={styles.sessionInfo}>
        Session:{" "}
        {currentSession
          ? formatDate(new Date(currentSession.date))
          : "Not started"}
      </Text>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedStudents}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={submitParticipation}
        disabled={selectedStudents.length === 0}
      >
        <Text style={styles.submitButtonText}>Submit Participation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sessionInfo: {
    fontSize: 16,
    marginBottom: 20,
  },
  studentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedStudent: {
    backgroundColor: "#e6f3ff",
  },
  studentName: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
