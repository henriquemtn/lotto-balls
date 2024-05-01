import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

export default function Dashboard() {
  const navigation = useNavigation<StackTypes>();
  const [showSocialIcons, setShowSocialIcons] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    // Limpa os estados quando o componente for desmontado
    return () => {
      setShowSocialIcons(false);
      setShowDocs(false);
      setShowRules(false);
    };
  }, []);

  const handleOpenDocs = () => {
    if (showDocs == true) {
      setShowDocs(false);
    } else {
      setShowDocs(true);
    }
  };

  const handleOpenSI = () => {
    if (showSocialIcons == true) {
      setShowSocialIcons(false);
    } else {
      setShowSocialIcons(true);
    }
  };

  const handleOpenRules = () => {
    if (showRules == true) {
      setShowRules(false);
    } else {
      setShowRules(true);
    }
  };

  const handleOpenSocial = (social: string) => {
    let url;
    switch (social) {
      case "facebook":
        url = "https://www.facebook.com/profile.php?id=61558636906453";
        break;
      case "instagram":
        url = "https://www.instagram.com/lottoballs/";
        break;
      case "youtube":
        url = "https://www.youtube.com/channel/UCaBVpt85473VYLKuwtjiudg";
        break;
      case "twitter":
        url = "https://twitter.com/lottoballsgame";
        break;
      default:
        return;
    }
    Linking.openURL(url);
  };

  return (
    <LinearGradient colors={["#281411", "#090606"]} className="h-full w-full">
      <TopBar />

      {showSocialIcons && (
        <View className="z-20 absolute w-full h-full items-center justify-center bg-black/50">
          <Animated.View
            entering={ZoomIn.delay(200).duration(400)}
            exiting={ZoomOut.delay(0).duration(0)}
            className="w-[50%] h-[80%] bg-[#12090A] rounded-md p-2"
          >
            <View className="w-full flex items-end">
              <TouchableOpacity onPress={handleOpenSI}>
                <AntDesign name="closesquareo" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View className="pt-4">
              <TouchableOpacity
                onPress={() => handleOpenSocial("facebook")}
                className="p-2 border border-white flex flex-row items-center rounded-md mb-2"
              >
                <AntDesign name="facebook-square" size={24} color="white" />
                <Text className="text-white ml-2">Follow us on Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOpenSocial("instagram")}
                className="p-2 border border-white flex flex-row items-center rounded-md mb-2"
              >
                <AntDesign name="instagram" size={24} color="white" />
                <Text className="text-white ml-2">Follow us on Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOpenSocial("youtube")}
                className="p-2 border border-white flex flex-row items-center rounded-md mb-2"
              >
                <AntDesign name="youtube" size={24} color="white" />
                <Text className="text-white ml-2">
                  Subscribe to our YouTube Channel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOpenSocial("twitter")}
                className="p-2 border border-white flex flex-row items-center rounded-md mb-2"
              >
                <AntDesign name="twitter" size={24} color="white" />
                <Text className="text-white ml-2">Follow us on Twitter</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {showDocs && (
        <View className="z-20 absolute w-full h-full items-center justify-center bg-black/50">
          <Animated.View
            entering={ZoomIn.delay(200).duration(400)}
            exiting={ZoomOut.delay(0).duration(0)}
            className="w-[50%] h-[80%] bg-[#12090A] rounded-md p-2"
          >
            <View className="w-full flex items-end">
              <TouchableOpacity onPress={handleOpenDocs}>
                <AntDesign name="closesquareo" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View className="w-full flex flex-row gap-x-2 mt-2">
              <Text className="text-white font-bold">UPDATED</Text>
              <Text className="text-white">01/05/2024 release beta.</Text>
            </View>
          </Animated.View>
        </View>
      )}

      {showRules && (
        <View className="z-20 absolute w-full h-full items-center justify-center bg-black/50">
          <Animated.View
            entering={ZoomIn.delay(200).duration(400)}
            exiting={ZoomOut.delay(0).duration(0)}
            className="w-[50%] h-[80%] bg-[#12090A] rounded-md p-2"
          >
            <View className="w-full flex items-end">
              <TouchableOpacity onPress={handleOpenRules}>
                <AntDesign name="closesquareo" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View className="w-full flex flex-col mt-2">
              <Text className="text-white">1. Click Play Button.</Text>
              <Text className="text-white">
                2. Activate or deactivate the cards and randomly define the
                numbers or choose each one.
              </Text>
              <Text className="text-white">
                3. Select how much you want to bet, the bet amount multiplies
                for each activated card.
              </Text>
              <Text className="text-white">
                4. Click on the green play button to start roulette.
              </Text>
              <Text className="text-white">
                5. You win by matching any and first, first you need to match
                the numbers from left to right in the same order as roulette,
                and any you just need to match the number.
              </Text>
            </View>
          </Animated.View>
        </View>
      )}

      <View className="px-5 flex-row h-full">
        <View className="w-2/3 h-full justify-center items-center pr-8 mt-[10px] py-5">
          <Image
            source={require("../../assets/goldenlotto.png")}
            className="w-full h-2/3 mt-[35px]"
            resizeMode="contain"
          />
          <View className="flex-row w-full justify-end items-end gap-1 mt-1">
            <TouchableOpacity
              onPress={handleOpenSI}
              className="flex-row h-[60px] rounded-md justify-center items-center"
            >
              <Image
                source={require("../../assets/social-icons.png")}
                className="w-[70px] h-16 "
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenDocs}
              className="flex-row h-[60px] bg-[#1E1E1E] rounded-md justify-center items-center"
            >
              <Image
                source={require("../../assets/doc.png")}
                className="w-[70px] h-16"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenRules}
              className="flex-row h-[60px] bg-[#1E1E1E] rounded-md justify-center items-center"
            >
              <Image
                source={require("../../assets/how-play.png")}
                className="w-[224px] h-[68px]"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-1/3 justify-between ml-2 mt-[55px] py-5">
          <TouchableOpacity
            onPress={() => navigation.navigate("Shop")}
            className="w-full h-1/2"
          >
            <Image
              source={require("../../assets/freecoins.png")}
              className="w-full h-full rounded-md"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Game")}
            className="mt-4 px-2 w-full h-1/2 rounded-md justify-center items-center"
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
