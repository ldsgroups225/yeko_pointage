import React from "react";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { CsIconProps } from "./type";

export const CsIcon: React.FC<CsIconProps> = ({
  type = "fontawesome5",
  name,
  size = 24,
  color = "black",
  style,
}) => {
  switch (type) {
    case "ionicons":
      return (
        <Ionicons name={name as any} size={size} color={color} style={style} />
      );
    case "material":
      return (
        <MaterialIcons
          name={name as any}
          size={size}
          color={color}
          style={style}
        />
      );
    case "fontawesome5":
    default:
      return (
        <FontAwesome5
          name={name as any}
          size={size}
          color={color}
          style={style}
        />
      );
  }
};

export default CsIcon;
