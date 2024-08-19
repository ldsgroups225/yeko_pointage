import { TextStyle, ViewStyle } from "react-native";

export interface CsChipProps {
  label: string;
  onPress?: () => void;
  isSelected?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
