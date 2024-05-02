import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";

export default function Welcome() {
  const navigation = useNavigation<StackTypes>();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    function updatedProgress() {
      setProgress((currentProgress) => {
        if (currentProgress < 1) {
          setTimeout(updatedProgress, 0);
        } else {
          setLoadingComplete(true);
        }
        return currentProgress + 0.01;
      });
    }
    updatedProgress();
  }, []);
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        MADEKenfolg: require("../../assets/fonts/MADEKenfolg.otf"),
      });
      setFontLoaded(true);
    }

    loadFont();
  }, []);

  return (
    <LinearGradient
      colors={["#281411", "#090606"]}
      className="flex-row justify-between h-full w-full"
    >
      <View className="w-full items-center justify-between h-3/4 p-4">
        <Image
          className="w-full h-full"
          resizeMode="contain"
          source={require("../../assets/goldenlotto.png")}
        />

        {loadingComplete ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("SignIn")}
            className="w-1/2 mt-6  p-3 rounded-full items-center"
          >
            <Text
              style={{
                fontFamily: "MADEKenfolg",
                fontSize: 20,
                color: "white",
              }}
            >
              Touch the Screen to Login
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="w-[40%] items-center h-1/2 pt-4 z-20">
            <Image
              resizeMode="stretch"
              className="w-full h-[30] mt-[14px] absolute z-40"
              source={require("../../assets/loading-bar.png")}
            />
            <View className="w-full justify-center">
              <View className="mx-0.4" style={{ width: "98%", height: 28 }}>
                <ImageBackground
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    width: `${progress * 100}%`,
                  }}
                  source={require("../../assets/loading-bar-progress.png")}
                  resizeMode="stretch"
                ></ImageBackground>
              </View>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
