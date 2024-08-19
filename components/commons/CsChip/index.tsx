import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useThemedStyles } from "@/hooks";
import { CsChipProps } from "./type";
import { createStyles } from "./style";

export const CsChip: React.FC<CsChipProps> = ({
  label,
  onPress,
  isSelected = false,
  style,
  textStyle,
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.selectedChip, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.label, isSelected && styles.selectedLabel, textStyle]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
