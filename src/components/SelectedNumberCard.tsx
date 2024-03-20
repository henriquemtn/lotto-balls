import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const cardImages: { [key: number]: any } = {
  0: require("../../assets/Plaques/Plaque-0-01.png"),
  1: require("../../assets/Plaques/Plaque-1-01.png"),
  2: require("../../assets/Plaques/Plaque-2-01.png"),
  3: require("../../assets/Plaques/Plaque-3-01.png"),
  4: require("../../assets/Plaques/Plaque-4-01.png"),
  5: require("../../assets/Plaques/Plaque-5-01.png"),
  6: require("../../assets/Plaques/Plaque-6-01.png"),
  7: require("../../assets/Plaques/Plaque-7-01.png"),
  8: require("../../assets/Plaques/Plaque-8-01.png"),
  9: require("../../assets/Plaques/Plaque-9-01.png"),
};

export default function SelectedNumberCard({ number, onPress }: any) {
  const incrementNumber = () => {
    const newNumber = (number + 1) % 10; // Incrementa o número atual e faz o módulo 10
    onPress(newNumber); // Chama a função onPress passando o novo número como argumento
  };

  const backgroundImage = cardImages[number];

  return (
    <View className="flex-col w-1/6 items-center max-h-[75%]">
      <Image
        source={backgroundImage}
        style={{ width: "90%", height: "100%", resizeMode: "cover", borderRadius: 4 }}
      />

      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
          width: "90%",
          paddingTop: 4
        }}
        onPress={incrementNumber}
      >
        <Image
          source={require("../../assets/upButton.png")}
          style={{ width: "100%", borderRadius: 4, resizeMode: "cover" }}
        />
      </TouchableOpacity>
    </View>
  );
}
