import {
  StyleSheet,
  Image,
  ImageBackground,
  View,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
  Easing,
  FadeInRight,
  PinwheelIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Keyframe } from "react-native-reanimated";

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
  10: require("../../assets/Balls/goldenbar-placeholder.png"),
  11: require("../../assets/Balls/ball-0.png"),
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
  10: require("../../assets/Balls/goldenbar-placeholder.png"),
};

const { width: windowWidth } = Dimensions.get("window");
const halfWindowWidth = windowWidth / 2;
console.log(halfWindowWidth);

export default function Roulette({
  cardNumber,
  rouletteNumbers,
  isClicked,
}: any) {
  const [bets, setBets] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [nums, setNums] = useState<number[]>([11, 11, 11, 11, 11, 11]);
  const initialBets = [...bets];

  useEffect(() => {
    if (cardNumber && cardNumber.length > 0) {
      setBets(cardNumber[0]);
    }
  }, [cardNumber]);

  useEffect(() => {
    if (rouletteNumbers && rouletteNumbers.length > 0) {
      setNums(rouletteNumbers);
    } else {
      setNums([11, 11, 11, 11, 11, 11]);
    }
  }, [rouletteNumbers]);

  const groupedBets: number[][] = [];
  for (let i = 0; i < initialBets.length; i += 6) {
    const subArray = initialBets.slice(i, i + 6);
    groupedBets.push(subArray);
  }

  return (
    <ImageBackground
      source={require("../../assets/roulette.png")}
      className="h-[80px] flex w-full justify-center items-center relative rounded-md"
      resizeMode="stretch"
    >
      <Image 
      source={require("../../assets/roulette1.png")}
      className="absolute h-[80px] flex w-full justify-center items-center z-20 rounded-md"
      resizeMode="stretch"
       />
      <Animated.View
        key={rouletteNumbers}
        style={styles.row}
        className="justify-center items-center"
      >
        {nums &&
          nums.map((num: number, index: number) => {
            let matchIndex = -1;
            // Verificar cada subarray de groupedBets para encontrar uma correspondência
            groupedBets.forEach((subArray, arrayIndex) => {
              if (subArray[index] === num) {
                // Calcular o índice correspondente com base no índice atual e no índice da submatriz
                matchIndex = arrayIndex * 6 + index;
              }
            });

            const delay = index * 200; // Ajuste conforme necessário
            const duration = 500 + (5 - index) * 150; // Ajuste conforme necessário

            if (!isClicked && matchIndex !== -1) {
              return (
                <Animated.View key={index}
                entering={SlideInRight.delay(delay).duration(duration)}
                >
                  <Image
                    key={index}
                    source={ballImagesCorrect[num]}
                    style={{
                      width: 68,
                      height: 68,
                      marginHorizontal: 2,
                    }}
                  />
                </Animated.View>
              );
            } else {
              return (
                <Animated.View
                  key={index}
                  entering={SlideInRight.delay(delay).duration(duration)}
                >
                  <Image
                    key={index}
                    source={ballImages[num]}
                    style={{
                      width: 68,
                      height: 68,
                      marginHorizontal: 2,
                    }}
                  />
                </Animated.View>
              );
            }
          })}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
});
