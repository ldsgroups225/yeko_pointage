import React from "react";
import { useThemedStyles } from "@/hooks";
import { CsCard, CsText } from "@/components/commons";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { shadows, spacing } from "@/styles";

interface StatCardProps {
  icon: string;
  title: string;
  value: number | string;
  color: string;
  unit?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  color,
  unit,
}) => {
  const styles = useThemedStyles(createStyles);
  return (
    <CsCard style={styles.statCard}>
      <FontAwesome5
        name={icon}
        size={18}
        color={color}
        style={styles.statIcon}
      />
      <View style={styles.statContent}>
        <CsText variant="h3" style={{ ...styles.statValue, color }}>
          {value}
          {unit}
        </CsText>
        <CsText variant="caption" style={styles.statTitle}>
          {title}
        </CsText>
      </View>
    </CsCard>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    statsContainer: {
      marginBottom: spacing.md,
    },
    statCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.sm,
      marginBottom: spacing.sm,
      ...shadows.small,
    },
    statIcon: {
      marginRight: spacing.sm,
    },
    statContent: {
      flex: 1,
    },
    statValue: {
      fontWeight: "bold",
    },
    statTitle: {
      color: theme.textLight,
    },
  });
