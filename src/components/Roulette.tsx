import React from "react";
import { ImageBackground, View } from "react-native";
import Card from "./Card";
import Animated, { SlideInRight } from "react-native-reanimated";

export default function Roulette({
  rouletteNumbers = [],
  rouletteResult = [],
}: any) {
  return (
    <ImageBackground
      source={require("../../assets/roulette.png")}
      className="w-full justify-center items-center relative rounded-md"
    >
      <Animated.View
        className="px-[20px] w-full h-[27%] flex-row items-center justify-center"
        entering={SlideInRight.delay(0).duration(500)}
        exiting={SlideInRight.delay(0).duration(1000)}
      >
        {rouletteNumbers.map((number: any, index: any) => (
          <Card
            key={index}
            number={number}
            index={index}
            rouletteNumbers={rouletteNumbers}
          />
        ))}
      </Animated.View>
    </ImageBackground>
  );
}
