import { View, Text, StatusBar, TextInput, Alert, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";

import { FontAwesome } from "@expo/vector-icons";
import Button from "../components/Button";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function SignUp() {
  const navigation = useNavigation<StackTypes>();
  const [displayName, setDisplayName] = useState("");
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


  function handleSignUp() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (result) => {
        // Define o displayName
        await result.user?.updateProfile({
          displayName: displayName
        });
        alert("logado com sucesso");
        console.log(result);
        navigation.navigate("Home");
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
    
        console.error(error);
      });
}

  return (
    <View className="flex-1 bg-[#151515] px-6">
    <StatusBar barStyle="light-content" />

    <View className="w-1/2 py-2">
      <View className="flex flex-row items-center px-4 w-full h-10 bg-[#151515] my-4 border border-[#D2D2D2]">
        <FontAwesome name="user" size={24} color="white" />
        <TextInput
          className="text-black ml-4"
          placeholderTextColor="#D2D2D2"
          placeholder="Enter your name"
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View className="flex flex-row items-center px-4 w-full h-10 bg-[#151515] mb-4 border border-[#D2D2D2]">
        <FontAwesome name="envelope-o" size={24} color="white" />
        <TextInput
          className="text-black ml-4"
          placeholderTextColor="#D2D2D2"
          placeholder="Enter your email"
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View className="flex flex-row items-center px-4 w-full h-10 bg-[#151515] mb-4 border border-[#D2D2D2]">
        <FontAwesome name="lock" size={24} color="white" />
        <TextInput
          className="text-black ml-4"
          placeholderTextColor="#D2D2D2"
          placeholder="Enter your password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <Button blue title="Sign In" onPress={handleSignUp} />
      <TouchableOpacity onPress={onGoogleButtonPress}   className="flex-row justify-center mb-[7px] items-center w-full h-12 p-[10px] bg-[#] border-[1px] border-white">
        <Image source={require('../../assets/googleIcon.png')}/>
        <Text className="text-white ml-2">Continue with Google</Text>
      </TouchableOpacity>

      <View className="flex w-full justify-center flex-row mt-2">
        <Text className="text-white text-[13px]">
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text className="text-[#0066FF] text-[13px] ml-1">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  );
}