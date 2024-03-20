import { Text, Image, View } from "react-native";
import React from "react";
import Animated, { PinwheelIn, SlideInRight } from "react-native-reanimated";

// Importar todas as imagens necessárias
const ballImages: { [key: number]: any } = {
  0: require("../../assets/Balls/ball-0.png"),
  1: require("../../assets/Balls/ball-1.png"),
  2: require("../../assets/Balls/ball-2.png"),
  3: require("../../assets/Balls/ball-3.png"),
  4: require("../../assets/Balls/ball-4.png"),
  5: require("../../assets/Balls/ball-5.png"),
  6: require("../../assets/Balls/ball-6.png"),
  7: require("../../assets/Balls/ball-7.png"),
  8: require("../../assets/Balls/ball-8.png"),
  9: require("../../assets/Balls/ball-9.png"),
};

const ballImagesCorrect: { [key: number]: any } = {
  0: require("../../assets/Balls/ball-0-correct.png"),
  1: require("../../assets/Balls/ball-1-correct.png"),
  2: require("../../assets/Balls/ball-2-correct.png"),
  3: require("../../assets/Balls/ball-3-correct.png"),
  4: require("../../assets/Balls/ball-4-correct.png"),
  5: require("../../assets/Balls/ball-5-correct.png"),
  6: require("../../assets/Balls/ball-6-correct.png"),
  7: require("../../assets/Balls/ball-7-correct.png"),
  8: require("../../assets/Balls/ball-8-correct.png"),
  9: require("../../assets/Balls/ball-9-correct.png"),
};

export default function Card({ number, index, rouletteNumbers }: any) {
  const backgroundImage = ballImages[number];
  const isCorrect = rouletteNumbers.includes(number);
  const ballImage = isCorrect ? ballImagesCorrect[number] : backgroundImage;

  return (
    <Animated.View key={index} entering={SlideInRight.delay(500).duration(500)}>
      <Animated.View key={index} entering={PinwheelIn.delay(500).duration(1000)}>
        <Image
          source={ballImage}
          style={{ width: 72, height: 72, marginHorizontal: 2 }}
        />
      </Animated.View>
    </Animated.View>
  );
}
