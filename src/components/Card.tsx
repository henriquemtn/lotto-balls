import { Text, Image, View } from "react-native";
import React, { useEffect, useState } from "react";
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

export default function Card({ number, rouletteNumbers, betNumbers }: any) {
  const [correctNumbers, setCorrectNumbers] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const flatBetNumbers = betNumbers.flat();
    const newCorrectNumbers: { [key: number]: boolean } = {};

    // Verifica se o número apostado está presente nos números sorteados pela roleta
    rouletteNumbers.forEach((rouletteNumber: number) => {
      if (flatBetNumbers.includes(rouletteNumber)) {
        newCorrectNumbers[rouletteNumber] = true;
      }
    });

    setCorrectNumbers(prevCorrectNumbers => ({
      ...prevCorrectNumbers,
      ...newCorrectNumbers
    }));
  }, [number, rouletteNumbers, betNumbers]);

  const isCorrect = correctNumbers[number];

  console.log("Número atual:", number);
  console.log("Números sorteados pela roleta:", rouletteNumbers);
  console.log("Números apostados:", betNumbers);
  console.log("Está correto?", isCorrect);

  const ballImage = isCorrect ? ballImagesCorrect[number] : ballImages[number];

  return (
    <Animated.View
      key={rouletteNumbers}
      entering={SlideInRight.delay(0).duration(400)}
    >
      <Animated.View
        key={rouletteNumbers}
        entering={PinwheelIn.delay(0).duration(1000)}
      >
        <Image
          source={ballImage}
          style={{
            width: 70,
            height: 70,
            marginHorizontal: 2,
            marginBottom: 4,
          }}
        />
      </Animated.View>
    </Animated.View>
  );
}
