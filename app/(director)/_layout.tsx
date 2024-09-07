import React from "react";
import { Stack } from "expo-router";
import { useAuth, useThemedStyles } from "@/hooks";
import { CsText } from "@/components/commons";
import { View, StyleSheet } from "react-native";
import { typography, spacing } from "@/styles";

const DirectorLayout = () => {
  const { user } = useAuth();
  const styles = useThemedStyles(createStyles);

  if (!user || user.role !== "director") {
    return (
      <View style={styles.unauthorizedContainer}>
        <CsText variant="h2" color="error">
          Accès non autorisé
        </CsText>
        <CsText variant="body">
          Vous n'avez pas la permission d'accéder à cette zone.
        </CsText>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="configure-tablet"
        options={{
          title: "Configurer la tablette",
        }}
      />
    </Stack>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.primary,
    },
    headerTitle: {
      ...typography.h4,
      color: theme.textLight,
    },
    unauthorizedContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.lg,
    },
  });

export default DirectorLayout;
