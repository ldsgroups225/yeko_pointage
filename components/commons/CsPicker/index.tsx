import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useThemedStyles } from "@/hooks";
import CsText from "../CsText";
import { CsPickerProps } from "./type";
import { createStyles } from "./style";

export const CsPicker: React.FC<CsPickerProps> = ({
  label,
  items,
  selectedValue,
  onValueChange,
  style,
  placeholder = "",
}) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.container, style]}>
      <CsText variant="body" style={styles.label}>
        {label}
      </CsText>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {/* Add a placeholder item if selectedValue is null or undefined */}
        {!selectedValue && (
          <Picker.Item
            label={placeholder}
            value={null}
            style={styles.placeholder}
          />
        )}
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};
