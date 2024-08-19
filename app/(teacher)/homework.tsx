import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useHomework } from "@/hooks/useHomework";
import HomeworkForm from "@/components/HomeworkForm";
import { useAtom } from "jotai";
import { currentClassAtom } from "@/store/atoms";
import { Homework } from "@/types";

export default function HomeworkScreen() {
  const { homeworkList, createHomework } = useHomework();
  const [currentClass] = useAtom(currentClassAtom);

  const renderHomeworkItem = ({ item }: { item: Homework }) => (
    <View style={styles.homeworkItem}>
      <Text style={styles.homeworkSubject}>{item.subject}</Text>
      <Text>{item.description}</Text>
      <Text>Due: {item.dueDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Homework</Text>
      {currentClass && (
        <HomeworkForm classId={currentClass.id} onSubmit={createHomework} />
      )}
      <FlatList
        data={homeworkList}
        renderItem={renderHomeworkItem}
        keyExtractor={(item) => item.id}
      />
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
  homeworkItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  homeworkSubject: {
    fontWeight: "bold",
  },
});
