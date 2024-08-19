import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useOfflineSync } from "@/hooks/useOfflineSync";

export default function SyncStatusIndicator() {
  const { syncStatus } = useOfflineSync();

  const getStatusColor = () => {
    switch (syncStatus) {
      case "idle":
        return "#34C759";
      case "syncing":
        return "#007AFF";
      case "error":
        return "#FF3B30";
      default:
        return "#8E8E93";
    }
  };

  return (
    <View style={styles.container}>
      {syncStatus === "syncing" && (
        <ActivityIndicator
          size="small"
          color="#007AFF"
          style={styles.spinner}
        />
      )}
      <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
      <Text style={styles.statusText}>
        {syncStatus === "idle" && "Synced"}
        {syncStatus === "syncing" && "Syncing..."}
        {syncStatus === "error" && "Sync Error"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  spinner: {
    marginRight: 5,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
  },
});
