import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";

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
  10: require("../../assets/Balls/goldenbar-placeholder.png"),
};

export default function Roulette({ cardNumber, rouletteNumbers }: any) {
  const [bets, setBets] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [nums, setNums] = useState<number[]>([10, 10, 10, 10, 10, 10]);
  const initialBets = [...bets];

  console.log("nums:", nums)

  useEffect(() => {
    if (cardNumber && cardNumber.length > 0) {
      setBets(cardNumber[0]);
    }
  }, [cardNumber]);

  useEffect(() => {
    if (rouletteNumbers && rouletteNumbers.length > 0) {
      setNums(rouletteNumbers);
    } else {
      setNums([10, 10, 10, 10, 10, 10]);
    }
  }, [rouletteNumbers]);  

  return (
    <ImageBackground
      source={require("../../assets/roulette.png")}
      className="w-full justify-center items-center relative rounded-md"
    >
      <View style={styles.row}>
        {nums && nums.map((num: number, index: number) => { // Verifica se nums é definido antes de chamar map
          const matchIndex = bets[index] === num ? index : -1;
          if (matchIndex !== -1) {
            initialBets[matchIndex] = -1; // Marca o número da aposta como corrigido na cópia
            return (
              <Image
                key={index}
                source={ballImagesCorrect[num]}
                style={{
                  width: 70,
                  height: 70,
                  marginHorizontal: 2,
                  marginBottom: 4,
                }}
              />
            );
          } else {
            return (
              <Image
                key={index}
                source={ballImages[num]}
                style={{
                  width: 70,
                  height: 70,
                  marginHorizontal: 2,
                  marginBottom: 4,
                }}
              />
            );
          }
        })}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});