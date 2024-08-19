import { StyleSheet } from "react-native";
import { borderRadius, spacing } from "@/styles";

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    chip: {
      backgroundColor: theme.background,
      borderRadius: borderRadius.round,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
      borderWidth: 1,
      borderColor: theme.border,
    },
    selectedChip: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    label: {
      color: theme.text,
      fontSize: 14,
    },
    selectedLabel: {
      color: "white",
    },
  });
