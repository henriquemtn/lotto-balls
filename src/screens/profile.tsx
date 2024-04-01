import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../routes/router";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const navigation = useNavigation<StackTypes>();

  const signOut = async () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate("SignIn");
        console.log("User signed out!");
        // Você pode adicionar qualquer lógica adicional aqui, como navegar para outra tela
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  const changeProfilePicture = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets) {
        // Access the first asset's uri
        const imageUrl = pickerResult.assets[0].uri;
        if (user) {
          await auth().currentUser?.updateProfile({ photoURL: imageUrl });
          setUser({ ...user, photoURL: imageUrl });

          // Resetar a navegação para a tela inicial (Home)
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        }
      }
    } catch (error) {
      console.error("Error changing profile picture:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#281411", "#090606"]}
      className="bg-[#0E0F11] h-full w-full"
    >
      <TopBar />

      <View className="w-full justify-center items-center mt-[70px]">
        {user && user.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            className="w-[125px] h-[125px] rounded-full"
          />
        ) : (
          <Image
            source={require("../../assets/avatar.png")}
            className="w-[55px] h-[55px] rounded-full"
          />
        )}
        <Text className="text-white font-medium text-xl mt-2">
          {user?.displayName}
        </Text>
        <TouchableOpacity
          onPress={changeProfilePicture}
          className=" bg-[#261B16] flex-row justify-center items-center rounded-md p-2 mt-2"
        >
          <FontAwesome name="camera" size={16} color="white" />
          <Text className="text-white text-base ml-2">
            Change Profile Picture
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signOut}
          className=" bg-[#261B16] flex-row justify-center items-center rounded-md p-2 mt-2"
        >
          <FontAwesome name="sign-out" size={16} color="white" />
          <Text className="text-white text-base ml-2">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-[#2D2423] w-full h-[1px] my-4" />
    </LinearGradient>
  );
}
