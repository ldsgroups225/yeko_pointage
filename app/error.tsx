import React from "react";
import { View, StyleSheet } from "react-native";
import { ErrorBoundaryProps } from "expo-router";
import { CsText, CsButton } from "@/components/commons";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";

export default function ErrorScreen(props: ErrorBoundaryProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <CsText variant="h2" style={styles.title}>
        An error occurred
      </CsText>
      <CsText variant="body" style={styles.message}>
        {props.error.message}
      </CsText>
      <CsButton title="Try again" onPress={props.retry} style={styles.button} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
      backgroundColor: theme.background,
    },
    title: {
      marginBottom: spacing.md,
    },
    message: {
      marginBottom: spacing.lg,
      textAlign: "center",
    },
    button: {
      minWidth: 200,
    },
  });
