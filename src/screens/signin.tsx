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
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";

import { FontAwesome } from "@expo/vector-icons";
import Button from "../components/Button";

export default function SignIn() {
  const navigation = useNavigation<StackTypes>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <View className="flex-1 bg-[#151515] px-6">
      <StatusBar barStyle="light-content" />

      <View className="w-1/2 py-2">
        <Text className="text-white text-xl">Login in to your account</Text>
        <Text className="text-[#5A626A]">
          Welcome back! Please enter your details!
        </Text>

        <View className="flex flex-row items-center px-4 w-full h-10 bg-[#151515] my-4 border border-[#D2D2D2]">
          <FontAwesome name="envelope-o" size={24} color="white" />
          <TextInput
            className="text-white ml-4"
            placeholderTextColor="#D2D2D2"
            placeholder="Enter your email"
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View className="flex flex-row items-center px-4 w-full h-10 bg-[#151515] mb-4 border border-[#D2D2D2]">
          <FontAwesome name="lock" size={24} color="white" />
          <TextInput
            className="text-white ml-4"
            placeholderTextColor="#D2D2D2"
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <Button blue title="Sign In" onPress={handleSignIn} />
        <TouchableOpacity onPress={onGoogleButtonPress}   className="flex-row justify-center mb-[7px] items-center w-full h-12 p-[10px] bg-[#] border-[1px] border-white">
          <Image source={require('../../assets/googleIcon.png')}/>
          <Text className="text-white ml-2">Continue with Google</Text>
        </TouchableOpacity>

        <View className="flex w-full justify-center flex-row mt-2">
          <Text className="text-white text-[13px]">
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text className="text-[#0066FF] text-[13px] ml-1">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
