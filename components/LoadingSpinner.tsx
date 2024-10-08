import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type LoadingSpinnerProps = {
  size?: "small" | "large";
  color?: string;
};

export default function LoadingSpinner({
  size = "large",
  color = "#007AFF",
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
