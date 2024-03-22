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

const cardImagesCorrect: { [key: number]: any } = {
  0: require("../../assets/Plaques/Plaque-0-correct.png"),
  1: require("../../assets/Plaques/Plaque-1-correct.png"),
  2: require("../../assets/Plaques/Plaque-2-correct.png"),
  3: require("../../assets/Plaques/Plaque-3-correct.png"),
  4: require("../../assets/Plaques/Plaque-4-correct.png"),
  5: require("../../assets/Plaques/Plaque-5-correct.png"),
  6: require("../../assets/Plaques/Plaque-6-correct.png"),
  7: require("../../assets/Plaques/Plaque-7-correct.png"),
  8: require("../../assets/Plaques/Plaque-8-correct.png"),
  9: require("../../assets/Plaques/Plaque-9-correct.png"),
};

export default function SelectedNumberCard({ number, onPress, isCorrect }: any) {
  const backgroundImage = isCorrect ? cardImagesCorrect[number] : cardImages[number];

  const incrementNumber = () => {
    const newNumber = (number + 1) % 10; // Incrementa o número atual e faz o módulo 10
    onPress(newNumber); // Chama a função onPress passando o novo número como argumento
  };
  
  return (
    <View className="flex-col w-1/6 items-center max-h-[75%] px-[1px]">
      <Image
        source={backgroundImage}
        style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 4 }}
      />

      <TouchableOpacity
        onPress={incrementNumber}
        style={{ width: "100%", height: "10%", paddingTop: 1 }}
      >
        <Image
          source={require("../../assets/upButton.png")}
          className="w-[37px] h-[26px]"
        />
      </TouchableOpacity>
    </View>
  );
}