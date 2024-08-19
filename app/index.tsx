import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { CsText } from "@/components/commons";
import { useThemedStyles, useAuth } from "@/hooks";
import { spacing } from "@/styles";

export default function Home() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/configure-tablet");
      } else {
        router.replace("/(auth)/qr-scan");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <CsText variant="h2">Loading...</CsText>
      </View>
    );
  }

  return null;
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
  });
