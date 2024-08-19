import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { formatFullName } from "@/utils/formatting";

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Text>No user logged in</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>
          {formatFullName(user.firstName, user.lastName)}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{user.role}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    width: 80,
  },
  value: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
