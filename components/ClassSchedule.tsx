import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Class, ClassSchedule as ClassScheduleType } from "@/types";

type ClassScheduleProps = {
  classInfo: Class;
};

export default function ClassSchedule({ classInfo }: ClassScheduleProps) {
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Render individual schedule items
  const renderScheduleItem = ({ item }: { item: ClassScheduleType }) => (
    <View style={styles.scheduleItem}>
      <Text style={styles.day}>
        {daysOfWeek[item.dayOfWeek].charAt(0).toUpperCase() +
          daysOfWeek[item.dayOfWeek].slice(1)}
      </Text>
      <Text style={styles.time}>
        {item.startTime} - {item.endTime}
      </Text>
      <Text style={styles.subject}>{item.subjectId}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class Schedule</Text>
      <Text style={styles.classInfo}>
        {classInfo.name} - Grade {classInfo.gradeId}
      </Text>
      <FlatList
        data={classInfo.schedule?.sort((a, b) => a.dayOfWeek - b.dayOfWeek)}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  classInfo: {
    fontSize: 18,
    marginBottom: 20,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  day: {
    width: 100,
    fontWeight: "bold",
  },
  time: {
    width: 120,
  },
  subject: {
    flex: 1,
    textAlign: "right",
  },
});
