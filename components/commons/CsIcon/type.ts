import { TextStyle, ViewStyle } from "react-native";

export type IconType = "ionicons" | "material" | "fontawesome" | "feather"; // Add other types as needed

export interface CsIconProps {
  type?: IconType;
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle | TextStyle;
}
