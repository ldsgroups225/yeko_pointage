import { TextStyle, ViewStyle } from "react-native";
import React from "react";

export type ButtonVariant = "primary" | "secondary" | "text" | "outline"; // Added outline
export type ButtonSize = "small" | "medium" | "large";

export interface CsButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
