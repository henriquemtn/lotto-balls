import {
  View,
  Text,
  StatusBar,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";

import { FontAwesome } from "@expo/vector-icons";
import Button from "../components/Button";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUp() {
  const navigation = useNavigation<StackTypes>();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  GoogleSignin.configure({
    webClientId:
      "1029275881324-ecg9au35kb4pkubal0pbu996e6ud0uag.apps.googleusercontent.com",
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

  function handleSignUp() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (result) => {
        // Define o displayName
        await result.user?.updateProfile({
          displayName: displayName,
        });
        alert("logado com sucesso");
        console.log(result);
        navigation.navigate("Home");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.error(error);
      });
  }

  return (
    <LinearGradient
      colors={["#281411", "#090606"]}
      className="flex-row h-full bg-[#151515] px-6 justify-center"
    >
      <StatusBar barStyle="light-content" />

      <View className="w-1/2 h-full justify-center py-2">
        <Text className="text-white text-xl font-[MADEKenfolg]">
          Create a new account
        </Text>
        <Text className="text-[#5A626A] font-[MADEKenfolg]">
          Please enter your details!
        </Text>

        <View className="flex flex-row items-center px-4 w-full h-12  my-2 rounded-md border-2 border-[#D2D2D2]">
          <FontAwesome name="user" size={24} color="white" />
          <TextInput
            className="text-white ml-4 font-[MADEKenfolg] w-full"
            placeholderTextColor="#D2D2D2"
            placeholder="Enter your name"
            onChangeText={(text) => setDisplayName(text)}
          />
        </View>

        <View className="flex flex-row items-center px-4 w-full h-12  mb-2 rounded-md border-2 border-[#D2D2D2]">
          <FontAwesome name="envelope-o" size={24} color="white" />
          <TextInput
            className="text-white pl-4 w-full font-[MADEKenfolg]"
            placeholderTextColor="#D2D2D2"
            placeholder="Enter your email"
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View className="flex flex-row items-center px-4 w-full h-12 mb-2 rounded-md border-2 border-[#D2D2D2]">
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
          onPress={handleSignUp}
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
          <Text className="text-white text-[13px] font-[MADEKenfolg]">
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text className="text-[#C88D1B] text-[13px] ml-1 font-[MADEKenfolg]">
              Sign In
            </Text>
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
