import React from "react";
import { StyleSheet, View } from "react-native";
import { CsListTile, CsText } from "@/components/commons";
import { useThemedStyles } from "@/hooks";
import { spacing } from "@/styles";
import { Class } from "@/types";

interface ClassSelectorProps {
  classes: Class[];
  selectedClass: Class | null;
  onSelectClass: (classItem: Class) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClass,
  onSelectClass,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <CsText variant="h3" style={styles.title}>
        Select Class
      </CsText>
      {classes.map((classItem) => (
        <CsListTile
          key={classItem.id}
          title={classItem.name}
          onPress={() => onSelectClass(classItem)}
          trailing={selectedClass?.id === classItem.id ? "✓" : undefined}
          style={styles.listTile}
        />
      ))}
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      marginVertical: spacing.md,
    },
    title: {
      marginBottom: spacing.sm,
    },
    listTile: {
      marginBottom: spacing.xs,
    },
  });
