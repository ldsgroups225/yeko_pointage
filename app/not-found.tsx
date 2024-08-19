import React from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { CsText, CsButton } from "@/components/commons";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";

export default function NotFoundScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <CsText variant="h2" style={styles.title}>
        Oops!
      </CsText>
      <CsText variant="body" style={styles.message}>
        We couldn't find the page you're looking for.
      </CsText>
      <Link href="/" asChild>
        <CsButton
          title="Go to Home"
          style={styles.button}
          onPress={() => console.log("Go to Home")}
        />
      </Link>
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
