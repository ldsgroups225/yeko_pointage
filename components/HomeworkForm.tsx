import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Homework } from "@/types";
import { formatDate } from "@/utils/dateTime";
import { useAtomValue } from "jotai/index";
import { currentScheduleAtom } from "@/store/atoms";

type HomeworkFormProps = {
  classId: string;
  onSubmit: (homework: Omit<Homework, "id">) => Promise<Homework>;
};

export default function HomeworkForm({ classId, onSubmit }: HomeworkFormProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isGraded, setIsGraded] = useState(false);

  const currentSchedule = useAtomValue(currentScheduleAtom);

  const handleSubmit = async () => {
    if (!subject || !description || !dueDate) {
      alert("Please fill in all fields");
      return;
    }

    const newHomework: Homework = {
      teacherId: "",
      classId,
      dueDate: formatDate(new Date(dueDate)),
      isGraded,
    };

    try {
      await onSubmit(newHomework);
      // Clear form fields after successful submission
      setSubject("");
      setDescription("");
      setDueDate("");
      setIsGraded(false);
    } catch (error) {
      console.error("Failed to create homework:", error);
      alert("Failed to create homework. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Homework</Text>
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <View style={styles.switchContainer}>
        <Text>Graded:</Text>
        <Switch value={isGraded} onValueChange={setIsGraded} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Assign Homework</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
