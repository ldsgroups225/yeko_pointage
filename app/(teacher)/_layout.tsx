import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Slot, useRouter, Link } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function TeacherLayout() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect non-(teacher) users
  if (user?.role !== "teacher") {
    router.replace("/");
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teacher Dashboard</Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.headerLink}>Exit Dashboard</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.nav}>
        <Link href="/attendance" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Attendance</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/participation" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Participation</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/homework" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Homework</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/incidents" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Incidents</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/session-summary" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Summary</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerLink: {
    color: "#007AFF",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#e0e0e0",
  },
  navItem: {
    padding: 5,
  },
  navText: {
    color: "#007AFF",
  },
});
