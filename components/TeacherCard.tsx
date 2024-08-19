import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Teacher } from "@/types";
import { formatInitials } from "@/utils/formatting";

type TeacherCardProps = {
  teacher: Teacher;
  onPress?: (teacher: Teacher) => void;
};

export default function TeacherCard({ teacher, onPress }: TeacherCardProps) {
  return (
    <TouchableOpacity onPress={() => onPress && onPress(teacher)}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>
            {formatInitials(teacher.fullName)}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{teacher.fullName}</Text>
          <Text style={styles.subjects}>{teacher.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  initials: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subjects: {
    fontSize: 14,
    color: "#666",
  },
});
