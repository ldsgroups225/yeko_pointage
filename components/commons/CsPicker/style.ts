import { StyleSheet } from "react-native";
import { spacing } from "@/styles";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      marginBottom: spacing.xs,
    },
    picker: {
      backgroundColor: theme.background,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
    },
  });
