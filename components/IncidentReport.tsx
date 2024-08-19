import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Incident, Student } from "@/types";
import { formatDate } from "@/utils/dateTime";

type IncidentReportProps = {
  students: Student[];
  onSubmit: (incident: Omit<Incident, "id">) => void;
};

export default function IncidentReport({
  students,
  onSubmit,
}: IncidentReportProps) {
  const [studentId, setStudentId] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("low");

  const handleSubmit = () => {
    if (!studentId || !description) {
      alert("Please fill in all fields");
      return;
    }

    const incident: Omit<Incident, "id"> = {
      studentId,
      description,
      severity,
      date: formatDate(new Date()),
    };

    onSubmit(incident);
    // Reset form
    setStudentId("");
    setDescription("");
    setSeverity("low");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Incident</Text>
      <Picker
        selectedValue={studentId}
        onValueChange={(itemValue) => setStudentId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a student" value="" />
        {students.map((student) => (
          <Picker.Item
            key={student.id}
            label={student.fullName}
            value={student.id}
          />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Incident Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Severity:</Text>
      <Picker
        selectedValue={severity}
        onValueChange={(itemValue) => setSeverity(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Low" value="low" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="High" value="high" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  picker: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
