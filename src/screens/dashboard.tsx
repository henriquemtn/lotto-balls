import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import TopBar from "../components/TopBar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";

export default function Dashboard() {
  const navigation = useNavigation<StackTypes>();

  return (
    <View className="bg-[#151515] h-full w-full">
      <TopBar />

      <View className="bg-[#2D2423] w-full h-[1px]" />

      <View className="px-5 flex-row justify-between h-full">
        <View className="w-2/3 justify-between pr-10 mt-[65px] py-5">
          <View className="h-[150px]">
            <TouchableOpacity onPress={() => navigation.navigate("Shop")} className="flex-row w-2/3 h-[60px] bg-[#1E1E1E] rounded-md justify-center items-center">
              <Ionicons name="cart" size={24} color='white' />
              <Text className="text-white text-base ml-2">Shop</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-1/3 justify-between mt-[65px] py-5">
          <View className="bg-slate-700 h-[100px] p-2">
            <Text className="text-white text-base font-medium">
              Patch Notes
            </Text>
            <Text className="text-[#D6D6D6] text-[14px]">Version 1.0.0!</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Game")} className="mt-4 w-full h-[60px] bg-[#FAB300] rounded-md justify-center items-center">
            <Text className="text-white text-base">Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
