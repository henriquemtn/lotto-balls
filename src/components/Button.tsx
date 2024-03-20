import { Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";

type Props = {
  title: string;
  onPress: any;
  outline?: boolean;
  blue?: boolean;
};

export default function Button({ title, onPress, outline, blue }: Props) {
  const textColor = "#FFFFFF"

  const buttonStyle: ViewStyle = {
    justifyContent: "center",
    marginBottom: 7,
    alignItems: "center",
    width: "100%",
    height: 48,
    padding: 10,
    backgroundColor: blue ? "#FAB300" : "transparent",
    borderWidth: outline ? 1 : 0,
    borderColor: outline ? "white" : "transparent",
  };

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={{ color: textColor }}>{title}</Text>
    </TouchableOpacity>
  );
}