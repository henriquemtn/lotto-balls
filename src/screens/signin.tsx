import {
  View,
  Text,
  StatusBar,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";
import * as Font from "expo-font";

import { FontAwesome } from "@expo/vector-icons";
import Button from "../components/Button";
import { LinearGradient } from "expo-linear-gradient";

export default function SignIn() {
  const navigation = useNavigation<StackTypes>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        MADEKenfolg: require("../../assets/fonts/MADEKenfolg.otf"),
      });
      setFontLoaded(true);
    }

    loadFont();
  }, []);

  GoogleSignin.configure({
    webClientId:
      "768922554564-lc85l2r31pch2v82imrmo7ovlc1bgna9.apps.googleusercontent.com",
  });

  const onGoogleButtonPress = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    try {
      const user_sign_in = await auth().signInWithCredential(googleCredential);
      console.log(user_sign_in);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };

  function handleSignIn() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        alert("logado com sucesso");
        console.log(result);
        navigation.navigate("Home");
      })
      .catch((error) => alert(error));
  }
  return (
    <LinearGradient
      colors={["#281411", "#090606"]}
      className="flex-row h-full bg-[#151515] px-6 justify-center"
    >
      <StatusBar barStyle="light-content" />

      <View className="w-1/2 h-full justify-center py-2">
        <Text className="text-white text-xl font-[MADEKenfolg]">Login in to your account</Text>
        <Text className="text-[#5A626A] font-[MADEKenfolg]">
          Welcome back! Please enter your details!
        </Text>

        <View className="flex flex-row items-center px-4 w-full  h-12  my-4 rounded-md border-2 border-[#D2D2D2]">
          <FontAwesome name="envelope-o" size={24} color="white" />
          <TextInput
            className="text-white pl-4 font-[MADEKenfolg] w-full"
            placeholderTextColor="#D2D2D2"
            placeholder="Enter your email"
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View className="flex flex-row items-center px-4 w-full  h-12 mb-4 rounded-md border-2 border-[#D2D2D2]">
          <FontAwesome name="lock" size={24} color="white" />
          <TextInput
            className="text-white pl-4 w-full font-[MADEKenfolg]"
            placeholderTextColor="#D2D2D2"
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity
          onPress={handleSignIn}
          className="flex-row justify-center mb-[7px] rounded-md items-center w-full h-12"
        >
          <Image
            source={require("../../assets/SignInButton.png")}
            className="w-full h-full rounded-md"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onGoogleButtonPress}
          className="flex-row justify-center mb-[7px] rounded-md items-center w-full h-12"
        >
          <Image
            source={require("../../assets/GoogleButton.png")}
            className="w-full h-full rounded-md"
          />
        </TouchableOpacity>

        <View className="flex w-full justify-center flex-row mt-2">
          <Text className="text-white text-[13px] font-[MADEKenfolg]">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text className="text-[#C88D1B] text-[13px] ml-1 font-[MADEKenfolg]">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-1/2 h-full justify-center items-center pt-10">
        <Image
          source={require("../../assets/Cassino.png")}
          className="w-full h-full rounded-md"
        />
      </View>
    </LinearGradient>
  );
}
