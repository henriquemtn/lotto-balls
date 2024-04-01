import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import TopBar from "../components/TopBar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";
import { LinearGradient } from "expo-linear-gradient";

export default function Dashboard() {
  const navigation = useNavigation<StackTypes>();

  return (
    <LinearGradient colors={["#281411", "#090606"]} className="h-full w-full">
      <TopBar />

      <View className="px-5 flex-row h-full">
        <View className="w-2/3 h-full justify-center items-center pr-8 mt-[10px] py-5">
          <Image
            source={require("../../assets/goldenlotto.png")}
            className="w-full h-2/3 mt-[35px]"
            resizeMode="contain"
          />
          <View className="flex-row w-full justify-end items-end gap-1 mt-1">
            <TouchableOpacity
              onPress={() => navigation.navigate("Shop")}
              className="flex-row h-[60px] rounded-md justify-center items-center"
            >
              <Image
                source={require("../../assets/social-icons.png")}
                className="w-[70px] h-16 "
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Shop")}
              className="flex-row h-[60px] bg-[#1E1E1E] rounded-md justify-center items-center"
            >
              <Image
                source={require("../../assets/doc.png")}
                className="w-[70px] h-16"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Shop")}
              className="flex-row h-[60px] bg-[#1E1E1E] rounded-md justify-center items-center"
            >
              <Image
                source={require("../../assets/how-play.png")}
                className="w-[224px] h-[68px]"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-1/3 justify-between mt-[55px] py-5">
          <TouchableOpacity onPress={() => navigation.navigate("Shop")} className="w-full h-1/2">
            <Image
              source={require("../../assets/freecoins.png")}
              className="w-full h-full rounded-md"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Game")}
            className="mt-4 w-full h-1/2 bg-[#FAB300] rounded-md justify-center items-center"
          >
            <Image
              source={require("../../assets/playButton.png")}
              className="w-full h-full  rounded-md"
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
