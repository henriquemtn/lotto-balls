import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";

export default function Welcome() {
    const navigation = useNavigation<StackTypes>();

  return (
    <View className="flex-row justify-between bg-[#1B1D20] h-full w-full">
      <View className="w-1/2 justify-between h-2/4  p-4">
        <Image 
        className=""
        source={require('../../assets/welcome.png')}
        />
      </View>

      <View className="bg-[#0E0F11] w-1/2 h-full p-4">
        <Text className="text-white font-semibold text-[32px] pt-4">
          Get ready to experience the thrill of the lottery like never before.
        </Text>
        <Text className="text-[#606060] pt-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} className="w-full mt-12 bg-[#FAB300] p-4 rounded-full items-center">
            <Text className="font-medium text-white text-xl">Get Started</Text>
          </TouchableOpacity>
          <View className="w-full flex-row justify-center mt-2">
            <Text className="text-white">Already have account?</Text>
            <Text className="ml-1 font-semibold text-[#FAB300]">Login</Text>
          </View>
      </View>
    </View>
  );
}
