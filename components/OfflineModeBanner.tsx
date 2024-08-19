import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAtom } from "jotai";
import { isOfflineModeAtom } from "@/store/atoms";

export default function OfflineModeBanner() {
  const [isOfflineMode] = useAtom(isOfflineModeAtom);

  if (!isOfflineMode) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        You are currently offline. Some features may be limited.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FFD60A",
    padding: 10,
    alignItems: "center",
  },
  text: {
    color: "#000",
    fontSize: 14,
    textAlign: "center",
  },
});
