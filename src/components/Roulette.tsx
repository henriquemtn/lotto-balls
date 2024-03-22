import React from "react";
import { ImageBackground, View } from "react-native";
import Card from "./Card";
import Animated, { SlideInRight } from "react-native-reanimated";

export default function Roulette({ rouletteNumbers, selectedNumbersList  }: any) {
  console.log(selectedNumbersList )
  return (
    <ImageBackground
      source={require("../../assets/roulette.png")}
      className="w-full justify-center items-center relative rounded-md"
    >
      <Animated.View
        className="px-[20px] w-full h-[23.38%] flex-row items-center justify-center"
        entering={SlideInRight.delay(200).duration(500)}
      >
         {rouletteNumbers.map((number: any, index: any) => (
          <Card
            key={index}
            number={number}
            rouletteNumbers={rouletteNumbers}
            betNumbers={selectedNumbersList } 
          />
        ))}
      </Animated.View>
    </ImageBackground>
  );
}
